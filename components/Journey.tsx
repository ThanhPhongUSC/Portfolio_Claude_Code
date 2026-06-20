"use client";

import Reveal from "./Reveal";
import { milestones, type Milestone } from "@/data/profile";

const tagColor: Record<Milestone["tag"], string> = {
  engineering: "text-electric-cyan border-electric-cyan/40 bg-electric-cyan/10",
  science: "text-electric-violet border-electric-violet/40 bg-electric-violet/10",
  education: "text-electric-blue border-electric-blue/40 bg-electric-blue/10",
};

const dotColor: Record<Milestone["tag"], string> = {
  engineering: "bg-electric-cyan shadow-[0_0_12px_2px_rgba(34,224,214,0.6)]",
  science: "bg-electric-violet shadow-[0_0_12px_2px_rgba(155,108,255,0.6)]",
  education: "bg-electric-blue shadow-[0_0_12px_2px_rgba(77,124,254,0.6)]",
};

export default function Journey() {
  return (
    <section id="journey" className="relative py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      <div className="shell relative">
        <Reveal>
          <p className="eyebrow">02 — Career Journey</p>
          <h2 className="mt-4 max-w-3xl text-balance font-display text-4xl font-bold leading-tight tracking-tight text-chalk sm:text-5xl">
            From electrochemistry to{" "}
            <span className="gradient-text">production code</span>.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            A decade of solving hard problems — first in the lab, now in the
            codebase. The throughline is the same: rigor, curiosity, and a drive
            to ship things that work.
          </p>
        </Reveal>

        <div className="relative mt-16">
          {/* Spine */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-electric-cyan/60 via-white/10 to-transparent sm:left-[11px]" />

          <ol className="space-y-10">
            {milestones.map((m, i) => (
              <li key={m.id} className="relative pl-10 sm:pl-14">
                <span
                  className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-ink ${dotColor[m.tag]} sm:left-1`}
                />
                <Reveal delay={i * 0.05}>
                  <article className="card card-hover p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs tracking-widest text-muted">
                        {m.period}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest ${tagColor[m.tag]}`}
                      >
                        {m.tag}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-chalk">
                      {m.role}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted">
                      <span className="text-chalk/90">{m.org}</span>
                      <span className="px-2 text-white/20">/</span>
                      {m.location}
                    </p>

                    <p className="mt-4 leading-relaxed text-muted">{m.body}</p>

                    {m.points && (
                      <ul className="mt-4 space-y-2.5">
                        {m.points.map((p, pi) => (
                          <li
                            key={`${m.id}-${pi}`}
                            className="flex gap-3 text-sm leading-relaxed text-muted/90"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-electric-cyan" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
