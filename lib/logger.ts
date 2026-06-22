/**
 * Minimal structured logging for the chat endpoint.
 *
 * Each event is written as a single line of JSON to stdout/stderr, which every
 * hosting platform (Vercel, Fly, a plain VPS) collects and makes searchable.
 * That gives you basic analytics — what visitors ask and how often — plus error
 * visibility, with no third-party service or API key required.
 *
 * Privacy: we log a short, truncated preview of the question (so you can see
 * what people ask) and never anything that identifies a visitor beyond the
 * coarse client id already used for rate limiting.
 */

const QUESTION_PREVIEW_CHARS = 200;

type ChatEvent =
  | { type: "request"; clientId: string; messageCount: number; question: string }
  | { type: "rate_limited"; clientId: string }
  | { type: "bad_request"; reason: string }
  | { type: "upstream_error"; status: number }
  | { type: "upstream_unreachable"; error: string }
  | { type: "completed"; clientId: string; durationMs: number };

export function logChatEvent(event: ChatEvent): void {
  const enriched =
    event.type === "request"
      ? { ...event, question: event.question.slice(0, QUESTION_PREVIEW_CHARS) }
      : event;

  const line = JSON.stringify({
    at: new Date().toISOString(),
    scope: "chat",
    ...enriched,
  });

  // Route failures to stderr so log tooling can alert on them separately.
  if (
    event.type === "upstream_error" ||
    event.type === "upstream_unreachable" ||
    event.type === "bad_request"
  ) {
    console.error(line);
  } else {
    console.log(line);
  }
}
