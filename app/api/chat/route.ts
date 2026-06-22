import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/data/profile";
import { createRateLimiter, getClientId } from "@/lib/rateLimit";
import { sanitizeMessages } from "@/lib/chatMessages";
import { logChatEvent } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "openai/gpt-oss-120b:free";

// The persona/career text is assembled from the shared profile data module,
// so the chatbot and the visible site stay in sync (single source of truth).
const SYSTEM_PROMPT = buildSystemPrompt();

// Per-visitor cap to protect the OpenRouter key from abuse (cost / free-tier
// limits). See lib/rateLimit.ts for the single-instance caveat.
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000; // 1 minute
const limiter = createRateLimiter({ limit: RATE_LIMIT, windowMs: WINDOW_MS });

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const clientId = getClientId(req.headers);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response("The chat is not configured (missing OPENROUTER_API_KEY).", {
      status: 500,
    });
  }

  if (!limiter.check(clientId)) {
    logChatEvent({ type: "rate_limited", clientId });
    return new Response(
      "You're sending messages a bit too fast. Please wait a moment and try again.",
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    logChatEvent({ type: "bad_request", reason: "invalid JSON body" });
    return new Response("Invalid request body.", { status: 400 });
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages);

  if (messages.length === 0) {
    logChatEvent({ type: "bad_request", reason: "no valid messages" });
    return new Response("No messages provided.", { status: 400 });
  }

  // Analytics: record what was asked (truncated, privacy-conscious).
  logChatEvent({
    type: "request",
    clientId,
    messageCount: messages.length,
    question: messages[messages.length - 1]!.content,
  });

  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Phong Trinh Digital Twin",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.6,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });
  } catch (err) {
    logChatEvent({ type: "upstream_unreachable", error: String(err) });
    return new Response("Could not reach the AI service. Please try again.", {
      status: 502,
    });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    logChatEvent({ type: "upstream_error", status: upstream.status });
    return new Response(
      `The AI service returned an error (${upstream.status}). ${detail.slice(0, 300)}`,
      { status: 502 }
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(":")) continue;
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              logChatEvent({
                type: "completed",
                clientId,
                durationMs: Date.now() - startedAt,
              });
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta: string | undefined = json?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Ignore keep-alive / partial fragments.
            }
          }
        }
        controller.close();
        logChatEvent({
          type: "completed",
          clientId,
          durationMs: Date.now() - startedAt,
        });
      } catch (err) {
        controller.error(err);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
