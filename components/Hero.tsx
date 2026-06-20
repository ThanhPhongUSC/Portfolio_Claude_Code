"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const stats = [
  { value: "650K+", label: "Users served" },
  { value: "7", label: "Tenant orgs secured" },
  { value: "3+", label: "Years shipping SaaS" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid animate-grid-drift [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-electric-blue/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-electric-violet/20 blur-[150px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-electric-cyan/10 blur-[130px]" />

      <div className="shell relative z-10 grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-chalk sm:text-6xl lg:text-7xl"
          >
            Phong Trinh
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-2xl font-medium tracking-tight sm:text-3xl"
          >
            <span className="gradient-text">Full-Stack Software Engineer</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted"
          >
            I build secure, scalable SaaS — from{" "}
            <span className="text-chalk">authentication systems trusted by 650K+ users</span>{" "}
            to the interfaces people touch every day. A chemistry PhD who
            traded the lab bench for the codebase, and never looked back.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group relative overflow-hidden rounded-full bg-chalk px-7 py-3.5 font-medium text-ink transition-transform hover:scale-[1.02]"
            >
              <span className="relative z-10">Let&rsquo;s work together</span>
            </a>
            <a
              href="#journey"
              className="rounded-full border border-white/15 px-7 py-3.5 font-medium text-chalk transition-colors hover:border-electric-cyan/50 hover:text-electric-cyan"
            >
              See my journey
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/[0.07] pt-7"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-bold tracking-tight text-chalk">
                  {s.value}
                </dt>
                <dd className="mt-1 font-mono text-[0.68rem] uppercase leading-snug tracking-wider text-muted">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm lg:mx-0"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-electric-cyan/30 via-electric-blue/20 to-electric-violet/30 blur-2xl" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-700">
            <Image
              src="/phong.jpeg"
              alt="Phong Trinh"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-70" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 font-mono text-xs">
              <span className="tracking-widest text-electric-cyan">
                DENVER, CO
              </span>
              <span className="flex items-center gap-1.5 tracking-widest text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-electric-cyan" />
                REMOTE-READY
              </span>
            </div>
          </div>
          {/* Corner ticks for the technical / blueprint feel */}
          <span className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-electric-cyan/60" />
          <span className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-electric-violet/60" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1">
          <span className="h-2 w-0.5 animate-pulse-dot rounded-full bg-electric-cyan" />
        </div>
      </div>
    </section>
  );
}
