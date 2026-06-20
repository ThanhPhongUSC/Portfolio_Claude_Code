export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-ink-700 font-display text-xs font-bold">
            <span className="gradient-text">PT</span>
          </span>
          <span className="font-mono text-xs tracking-widest text-muted">
            PHONG TRINH
          </span>
        </div>
        <p className="font-mono text-xs tracking-wider text-muted/70">
          © {year} · Designed &amp; built with Next.js
        </p>
        <a
          href="#top"
          className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-electric-cyan"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
