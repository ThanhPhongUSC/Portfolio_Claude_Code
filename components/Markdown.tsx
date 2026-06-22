import { type ReactNode } from "react";

/**
 * A tiny, safe markdown renderer for the AI chat.
 *
 * "Safe" means it builds real React elements — it never uses
 * `dangerouslySetInnerHTML`, so a model reply can't inject HTML or scripts.
 * It supports the light markdown the model actually emits: paragraphs, bullet
 * lists, **bold**, *italic* / _italic_, `inline code`, and [links](url).
 * Anything it doesn't recognize is rendered as plain text.
 */

/** Only allow links we trust; otherwise we keep the text but drop the link. */
function safeHref(url: string): string | null {
  const u = url.trim();
  return /^(https?:\/\/|mailto:)/i.test(u) ? u : null;
}

// One token = bold | inline code | link | italic. Bold is listed before
// italic so `**x**` matches as bold rather than two italics.
const INLINE =
  /(\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|_[^_]+_)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;

  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-${i++}`;

    if (tok.startsWith("**")) {
      out.push(<strong key={key}>{renderInline(tok.slice(2, -2), key)}</strong>);
    } else if (tok.startsWith("`")) {
      out.push(
        <code
          key={key}
          className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.8em] text-chalk"
        >
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok);
      const href = link ? safeHref(link[2]) : null;
      if (link && href) {
        out.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric-cyan underline underline-offset-2 hover:text-electric-cyan/80"
          >
            {link[1]}
          </a>
        );
      } else {
        // Unsafe or malformed link: keep the visible text, drop the link.
        out.push(link ? link[1] : tok);
      }
    } else {
      // *italic* or _italic_
      out.push(<em key={key}>{renderInline(tok.slice(1, -1), key)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ content }: { content: string }) {
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (!para.length) return;
    const k = key++;
    blocks.push(<p key={k}>{renderInline(para.join(" "), `p${k}`)}</p>);
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    const k = key++;
    const items = list;
    blocks.push(
      <ul key={k} className="list-disc space-y-1 pl-5">
        {items.map((it, idx) => (
          <li key={idx}>{renderInline(it, `li${k}-${idx}`)}</li>
        ))}
      </ul>
    );
    list = [];
  };

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      flushPara();
      list.push(bullet[1]);
    } else if (line === "") {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();

  return <div className="space-y-2">{blocks}</div>;
}
