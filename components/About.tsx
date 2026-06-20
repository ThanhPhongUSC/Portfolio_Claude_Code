"use client";

import Reveal from "./Reveal";

const highlights = [
  {
    title: "From the lab bench to the codebase",
    body: "As an electrochemist, I spent years fighting the outdated, crash-prone software bolted onto lab instruments. That frustration became fascination — and eventually a career.",
  },
  {
    title: "All-in on engineering",
    body: "When the pandemic hit, I committed fully: self-teaching, then 1,000+ hours through Hack Reactor's immersive program, learning full-stack development end to end.",
  },
  {
    title: "Software that actually matters",
    body: "I care about tools that make people's lives easier — software that's not just functional, but meaningful. I bring rigor, clear communication, and ownership to every project.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">01 — About</p>
          <h2 className="mt-4 max-w-3xl text-balance font-display text-4xl font-bold leading-tight tracking-tight text-chalk sm:text-5xl">
            A scientist&rsquo;s mind, an{" "}
            <span className="gradient-text">engineer&rsquo;s craft</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="space-y-6">
            <p className="text-lg leading-relaxed text-muted">
              I became a full-stack software engineer by way of chemistry. A PhD
              in electrochemistry taught me how to break impossibly hard problems
              into testable pieces, follow the evidence, and document everything
              so the next person can build on it.
            </p>
            <p className="text-lg leading-relaxed text-muted">
              At <span className="text-chalk">Remine</span>, I brought that same
              discipline to authentication and security — shipping MFA, password
              rotation, and Auth0 flows across a multi-tenant SaaS platform, plus
              the customizable dashboards and themes that users touched every day.
            </p>
            <p className="text-lg leading-relaxed text-muted">
              My path is nontraditional, and that&rsquo;s the point. It gives me a
              perspective most engineers don&rsquo;t have — and a stubborn habit of
              shipping reliable code in fast-moving teams.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                "Ph.D. Chemistry",
                "U.S. Patent Co-Inventor",
                "Summa Cum Laude",
                "Hack Reactor",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-ink-700/60 px-3.5 py-1.5 font-mono text-xs tracking-wide text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="space-y-4">
            {highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.08}>
                <article className="card card-hover group relative p-6 sm:p-7">
                  <div className="flex items-start gap-5">
                    <span className="mt-1 font-mono text-sm text-electric-cyan/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-chalk">
                        {h.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-muted">{h.body}</p>
                    </div>
                  </div>
                  <span className="absolute inset-x-7 bottom-0 h-px scale-x-0 bg-gradient-to-r from-electric-cyan/60 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
