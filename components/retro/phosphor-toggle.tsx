"use client"

import { useState } from "react"

const GREEN = "#3dff8f"
const AMBER = "#ffb02e"

export function PhosphorToggle() {
  const [color, setColor] = useState<"green" | "amber">("green")

  const toggle = () => {
    const next = color === "green" ? "amber" : "green"
    setColor(next)
    document.documentElement.style.setProperty("--phosphor", next === "green" ? GREEN : AMBER)
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-[9100] border border-[var(--phosphor)] bg-[var(--bg)] px-3 py-1.5 text-xs hover:bg-[var(--phosphor)] hover:text-[var(--bg)] transition-colors"
      aria-label="Toggle phosphor color"
    >
      [ {color === "green" ? "amber" : "green"} ]
    </button>
  )
}
