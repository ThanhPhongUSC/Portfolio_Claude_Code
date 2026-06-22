import { describe, it, expect } from "vitest";
import {
  sanitizeMessages,
  MAX_MESSAGES,
  MAX_CONTENT_CHARS,
} from "./chatMessages";

describe("sanitizeMessages", () => {
  it("returns [] for anything that isn't an array", () => {
    expect(sanitizeMessages(null)).toEqual([]);
    expect(sanitizeMessages(undefined)).toEqual([]);
    expect(sanitizeMessages("nope")).toEqual([]);
    expect(sanitizeMessages({ messages: [] })).toEqual([]);
  });

  it("keeps only well-formed user/assistant turns", () => {
    const out = sanitizeMessages([
      { role: "user", content: "hi" },
      { role: "system", content: "should be dropped" },
      { role: "assistant", content: "hello" },
      { role: "user", content: "   " }, // blank after trim
      { role: "user" }, // missing content
      { role: "user", content: 42 }, // non-string content
      null,
      "garbage",
    ]);
    expect(out).toEqual([
      { role: "user", content: "hi" },
      { role: "assistant", content: "hello" },
    ]);
  });

  it("keeps only the most recent MAX_MESSAGES", () => {
    const many = Array.from({ length: MAX_MESSAGES + 5 }, (_, i) => ({
      role: "user" as const,
      content: `m${i}`,
    }));
    const out = sanitizeMessages(many);
    expect(out).toHaveLength(MAX_MESSAGES);
    expect(out[0]!.content).toBe("m5"); // the first five are dropped
    expect(out[out.length - 1]!.content).toBe(`m${MAX_MESSAGES + 4}`);
  });

  it("truncates over-long content to MAX_CONTENT_CHARS", () => {
    const out = sanitizeMessages([
      { role: "user", content: "x".repeat(MAX_CONTENT_CHARS + 100) },
    ]);
    expect(out[0]!.content).toHaveLength(MAX_CONTENT_CHARS);
  });

  it("normalizes to exactly { role, content } (drops extra fields)", () => {
    const out = sanitizeMessages([
      { role: "user", content: "hi", id: "x", extra: true },
    ]);
    expect(out[0]).toEqual({ role: "user", content: "hi" });
  });
});
