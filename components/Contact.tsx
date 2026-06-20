"use client";

import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-blue/10 blur-[160px]" />
      <div className="shell relative">
        <Reveal>
          <div className="card relative overflow-hidden p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_40%,black,transparent)]" />
            <div className="relative">
              <p className="eyebrow">05 — Contact</p>
              <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-4xl font-bold leading-tight tracking-tight text-chalk sm:text-5xl">
                Let&rsquo;s build something{" "}
                <span className="gradient-text">worth shipping</span>.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
                I&rsquo;m open to new opportunities and collaborations. If you&rsquo;re
                looking for an engineer who owns problems end-to-end, I&rsquo;d love
                to hear from you.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:thanhphongus@gmail.com"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-chalk px-7 py-3.5 font-medium text-ink transition-transform hover:scale-[1.02]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  thanhphongus@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/phongtrinh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-3.5 font-medium text-chalk transition-colors hover:border-electric-cyan/50 hover:text-electric-cyan"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                  </svg>
                  linkedin.com/in/phongtrinh
                </a>
                <a
                  href="https://github.com/ThanhPhongUSC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-3.5 font-medium text-chalk transition-colors hover:border-electric-cyan/50 hover:text-electric-cyan"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
                  </svg>
                  github.com/ThanhPhongUSC
                </a>
              </div>

              <p className="mt-8 font-mono text-xs tracking-widest text-muted">
                DENVER METROPOLITAN AREA · REMOTE-READY
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
