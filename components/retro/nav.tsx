"use client"

import { useEffect, useState } from "react"

const SECTIONS = [
  { id: "home", label: "home" },
  { id: "about", label: "about" },
  { id: "projects", label: "projects" },
  { id: "blog", label: "blog" },
  { id: "contact", label: "contact" },
]

export function Nav() {
  const [active, setActive] = useState("home")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-40% 0px -50% 0px" },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="fixed top-0 inset-x-0 z-[9000] border-b border-[var(--phosphor)]/30 bg-[var(--bg)]/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between text-sm overflow-x-auto">
        <a href="#home" className="font-bold text-[var(--phosphor)] glow shrink-0">
          ashish@nagmoti
        </a>
        <div className="flex items-center gap-1 shrink-0">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={
                active === s.id
                  ? "px-2.5 py-1 bg-[var(--phosphor)] text-[var(--bg)] font-semibold"
                  : "px-2.5 py-1 text-[var(--dim)] hover:text-[var(--phosphor)] transition-colors"
              }
            >
              [{s.label}]
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
