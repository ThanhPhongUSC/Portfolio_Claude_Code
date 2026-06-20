"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Expertise", href: "#expertise" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-ink-700 font-display text-sm font-bold tracking-tight">
            <span className="gradient-text">PT</span>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-electric-cyan shadow-[0_0_10px_2px_rgba(34,224,214,0.7)]" />
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-chalk sm:block">
            Phong Trinh
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-chalk"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full border border-electric-cyan/40 bg-electric-cyan/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-electric-cyan transition-all hover:bg-electric-cyan/15 sm:block"
          >
            Get in touch
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-chalk md:hidden"
          >
            <div className="space-y-1">
              <span
                className={`block h-0.5 w-4 bg-current transition-transform ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-current transition-transform ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] bg-ink/95 backdrop-blur-xl md:hidden">
          <ul className="shell flex flex-col py-4">
            {[...links, { label: "Contact", href: "#contact" }].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-sm uppercase tracking-widest text-muted hover:text-chalk"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
