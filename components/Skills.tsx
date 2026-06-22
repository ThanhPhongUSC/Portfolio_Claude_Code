"use client";

import Reveal from "./Reveal";
import { skillGroups, focusAreas } from "@/data/profile";

export default function Skills() {
  return (
    <section id="expertise" className="relative py-28 sm:py-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">03 — Expertise</p>
          <h2 className="mt-4 max-w-3xl text-balance font-display text-4xl font-bold leading-tight tracking-tight text-chalk sm:text-5xl">
            The toolkit behind the <span className="gradient-text">work</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.07}>
              <div className="card card-hover h-full p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight text-chalk">
                  {g.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{g.blurb}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/[0.08] bg-ink/60 px-2.5 py-1 font-mono text-xs text-chalk/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {focusAreas.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-ink-700/80 to-ink p-6 card-hover">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-electric-cyan/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <h3 className="font-display text-lg font-semibold tracking-tight text-chalk">
                  {f.title}
                </h3>
                <p className="mt-2.5 leading-relaxed text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
