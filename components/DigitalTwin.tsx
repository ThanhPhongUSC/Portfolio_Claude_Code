"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Markdown from "./Markdown";

type Msg = { id: string; role: "user" | "assistant"; content: string };

// Where the conversation is saved so it survives a page refresh.
const STORAGE_KEY = "digital-twin-chat-v1";

/** Defensive check so we never trust whatever happens to be in localStorage. */
function isValidMsg(m: unknown): m is Msg {
  return (
    !!m &&
    typeof (m as Msg).id === "string" &&
    ((m as Msg).role === "user" || (m as Msg).role === "assistant") &&
    typeof (m as Msg).content === "string"
  );
}

const SUGGESTIONS = [
  "How did you get into software engineering?",
  "What did you build at Remine?",
  "What's your tech stack?",
  "Tell me about a project you're proud of.",
];

// How long to wait before giving up on a stalled response.
const RESPONSE_TIMEOUT_MS = 30_000;

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export default function DigitalTwin() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  // True once we've read localStorage, so we don't overwrite it before restoring.
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Lets us cancel the in-flight request (stop button / timeout).
  const abortRef = useRef<AbortController | null>(null);
  // Tracks WHY a request was aborted so we can show the right message.
  const stopReasonRef = useRef<"user" | "timeout" | null>(null);

  function stop() {
    stopReasonRef.current = "user";
    abortRef.current?.abort();
  }

  function clearChat() {
    stopReasonRef.current = "user";
    abortRef.current?.abort();
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore: storage may be unavailable (private mode, etc.).
    }
  }

  // Restore a saved conversation once, after mount (keeps SSR markup in sync
  // so there's no hydration mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed.filter(isValidMsg));
      }
    } catch {
      // Corrupt/unavailable storage — just start fresh.
    }
    setHydrated(true);
  }, []);

  // Persist after each completed turn. We skip while streaming so we only save
  // settled messages (not a half-written reply) and never the empty placeholder.
  useEffect(() => {
    if (!hydrated || streaming) return;
    try {
      const settled = messages.filter((m) => m.content.trim().length > 0);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settled));
    } catch {
      // Ignore write failures (quota, private mode, etc.).
    }
  }, [messages, hydrated, streaming]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const next: Msg[] = [
      ...messages,
      { id: uid(), role: "user", content: trimmed },
    ];
    const assistantId = uid();
    setMessages([...next, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    // (a) cancellable request + (b) auto-abort if it stalls.
    const controller = new AbortController();
    abortRef.current = controller;
    stopReasonRef.current = null;
    const timeoutId = setTimeout(() => {
      stopReasonRef.current = "timeout";
      controller.abort();
    }, RESPONSE_TIMEOUT_MS);

    const setAssistant = (content: string) =>
      setMessages([...next, { id: assistantId, role: "assistant", content }]);

    let acc = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || "Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setAssistant(acc);
      }
      if (!acc.trim()) {
        setAssistant("Hmm, I didn't get a response that time. Mind trying again?");
      }
    } catch {
      if (controller.signal.aborted) {
        if (stopReasonRef.current === "user") {
          // Keep whatever streamed in before the user stopped it.
          setAssistant(acc.trim() ? `${acc}\n\n_(stopped)_` : "_(stopped)_");
        } else {
          setAssistant(
            "That took too long, so I stopped waiting. Please try again."
          );
        }
      } else {
        setAssistant(
          "Sorry — I'm having trouble connecting right now. Please try again in a moment, or reach Phong via the contact section."
        );
      }
    } finally {
      clearTimeout(timeoutId);
      abortRef.current = null;
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        aria-label="Chat with Phong's Digital Twin"
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-electric-cyan to-electric-blue text-ink shadow-[0_10px_40px_-8px_rgba(34,224,214,0.6)]"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-cyan opacity-20" />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a9 9 0 0 0-9 9 8.7 8.7 0 0 0 1.2 4.4L3 21l4.8-1.2A9 9 0 1 0 12 3Z" />
              <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-3 left-3 z-50 flex h-[min(70vh,560px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:left-auto sm:right-5 sm:w-[400px]"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/[0.07] p-4">
              <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-electric-cyan/20 to-electric-violet/20 ring-1 ring-white/10">
                <span className="font-display text-sm font-bold">
                  <span className="gradient-text">PT</span>
                </span>
              </span>
              <div className="relative flex-1">
                <p className="font-display text-sm font-semibold text-chalk">
                  Digital Twin
                </p>
                <p className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-wider text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric-cyan shadow-[0_0_6px_1px_rgba(34,224,214,0.8)]" />
                  AI · ANSWERS ABOUT MY CAREER
                </p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  aria-label="Clear conversation"
                  title="Clear conversation"
                  className="relative grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-chalk"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
                  </svg>
                </button>
              )}
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-4"
            >
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/[0.07] bg-ink-700/70 px-4 py-3 text-sm leading-relaxed text-chalk/90">
                    👋 Hi! I&rsquo;m Phong&rsquo;s digital twin. Ask me anything
                    about his career, skills, or projects.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="rounded-full border border-white/10 bg-ink-700/50 px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-electric-cyan/40 hover:text-chalk"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "whitespace-pre-wrap rounded-br-sm bg-electric-blue/20 text-chalk ring-1 ring-electric-blue/30"
                        : "rounded-tl-sm border border-white/[0.07] bg-ink-700/70 text-chalk/90"
                    }`}
                  >
                    {m.content ? (
                      m.role === "assistant" ? (
                        <Markdown content={m.content} />
                      ) : (
                        m.content
                      )
                    ) : (
                      <span className="inline-flex gap-1 py-1">
                        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-electric-cyan" />
                        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-electric-cyan [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-electric-cyan [animation-delay:0.4s]" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-white/[0.07] p-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-700/60 py-1.5 pl-4 pr-1.5 focus-within:border-electric-cyan/40">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my career…"
                  disabled={streaming}
                  className="flex-1 bg-transparent text-sm text-chalk placeholder:text-muted/70 focus:outline-none disabled:opacity-60"
                />
                {streaming ? (
                  <button
                    type="button"
                    aria-label="Stop generating"
                    onClick={stop}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-chalk transition-colors hover:bg-white/25"
                  >
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-chalk" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!input.trim()}
                    className="grid h-8 w-8 place-items-center rounded-full bg-electric-cyan text-ink transition-opacity disabled:opacity-30"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-2 text-center font-mono text-[0.6rem] tracking-wider text-muted/60">
                AI-generated · may not be perfect
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
