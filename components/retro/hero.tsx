"use client"

import { Typewriter } from "./typewriter"

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center px-4 pt-12">
      <div className="max-w-3xl mx-auto w-full">
        <p className="text-sm text-[var(--dim)] mb-2">guest@ashish-nagmoti:~$ whoami</p>
        <h1 className="text-3xl sm:text-5xl font-bold glow mb-3">Ashish Nagmoti</h1>
        <div className="text-lg sm:text-xl text-[var(--phosphor)]/80 mb-6 min-h-[1.75rem]">
          <Typewriter text="AI & DS Student | Backend & Cloud Developer" speed={35} />
        </div>
        <p className="text-[var(--dim)] leading-relaxed mb-8 max-w-2xl">
          I love building impactful full-stack applications, with a strong focus on backend development, AI
          integration, and cloud infrastructure.
        </p>
        <div className="flex flex-wrap gap-3 mb-10">
          <a
            href="#projects"
            className="border border-[var(--phosphor)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--phosphor)] hover:text-[var(--bg)] transition-colors"
          >
            [ view projects ]
          </a>
          <a
            href="/clg_resume_v3.pdf"
            download
            className="border border-[var(--phosphor)]/40 px-5 py-2.5 text-sm text-[var(--dim)] hover:border-[var(--phosphor)] hover:text-[var(--phosphor)] transition-colors"
          >
            [ download resume ]
          </a>
        </div>
        <p className="text-sm text-[var(--dim)]">
          guest@ashish-nagmoti:~$ <span className="terminal-cursor">▌</span>
        </p>
      </div>
    </section>
  )
}
