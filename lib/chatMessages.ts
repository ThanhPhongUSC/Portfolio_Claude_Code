/**
 * Validation + sanitization for the chat history a client sends us.
 *
 * The browser can send anything, so the route must never trust the payload.
 * `sanitizeMessages` keeps only well-formed user/assistant turns, caps how many
 * we forward, and trims each message's length. Pulled out of the route so the
 * rules are unit-testable.
 */
export type ChatMessage = { role: "user" | "assistant"; content: string };

/** Keep the prompt small: only forward the most recent turns. */
export const MAX_MESSAGES = 12;
/** Guard against pathologically large messages. */
export const MAX_CONTENT_CHARS = 4000;

function isChatMessage(m: unknown): m is ChatMessage {
  return (
    !!m &&
    typeof m === "object" &&
    ((m as ChatMessage).role === "user" ||
      (m as ChatMessage).role === "assistant") &&
    typeof (m as ChatMessage).content === "string" &&
    (m as ChatMessage).content.trim().length > 0
  );
}

export function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isChatMessage)
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT_CHARS) }));
}
