import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/data/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "openai/gpt-oss-120b:free";

// The persona/career text is assembled from the shared profile data module,
// so the chatbot and the visible site stay in sync (single source of truth).
const SYSTEM_PROMPT = buildSystemPrompt();

/**
 * Simple in-memory, per-IP rate limiter.
 *
 * Allows up to RATE_LIMIT requests per WINDOW_MS per client. This protects the
 * OpenRouter key from abuse (cost / free-tier limits). Note: in-memory state is
 * per server instance and resets on restart — fine for a single-instance
 * portfolio. For multi-instance/serverless deployments, back this with a shared
 * store such as Upstash Redis instead.
 */
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000; // 1 minute
const hits = new Map<string, number[]>();

function getClientId(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Returns true if the request is allowed; false if the limit is exceeded. */
function checkRateLimit(id: string): boolean {
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(id, recent);
    return false;
  }
  recent.push(now);
  hits.set(id, recent);
  return true;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response("The chat is not configured (missing OPENROUTER_API_KEY).", {
      status: 500,
    });
  }

  if (!checkRateLimit(getClientId(req))) {
    return new Response(
      "You're sending messages a bit too fast. Please wait a moment and try again.",
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  const messages: ChatMessage[] = Array.isArray(rawMessages)
    ? (rawMessages as ChatMessage[])
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim().length > 0
        )
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))
    : [];

  if (messages.length === 0) {
    return new Response("No messages provided.", { status: 400 });
  }

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
    console.error("[chat] fetch to OpenRouter failed:", err);
    return new Response("Could not reach the AI service. Please try again.", {
      status: 502,
    });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
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
