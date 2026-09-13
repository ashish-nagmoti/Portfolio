"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const BOOT_MS = 3400
const QUOTE = "Life works in mysterious ways."

/**
 * An Avengers-style "A": a bold A inside a ring whose crossbar shoots out
 * through the ring as an arrow. Drawn in white, in the spirit of the Apple
 * boot logo. (The arrow matters: a plain circled A reads as the anarchy sign.)
 */
function AvengersA({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 116 100" fill="none" className={className} aria-hidden>
      {/* Ring, open on the right where the arrow exits */}
      <path d="M 85.8 48 A 38 38 0 1 0 82.5 68" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {/* Left leg, apex, and the right stroke down to the arrow */}
      <path d="M 22 88 L 48 14 L 72 58" stroke="currentColor" strokeWidth="10" strokeLinejoin="miter" strokeMiterlimit="6" />
      {/* Arrow shaft, from the left leg straight out through the ring */}
      <path d="M 33 58 L 97 58" stroke="currentColor" strokeWidth="9" />
      {/* Arrowhead */}
      <path d="M 113 58 L 95 45 L 95 71 Z" fill="currentColor" />
    </svg>
  )
}

// Apple's bar doesn't fill linearly: it moves quickly, then eases as it nears
// the end. Same idea here.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.4)

interface BootScreenProps {
  onDone: () => void
}

export function BootScreen({ onDone }: BootScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / BOOT_MS)
      setProgress(easeOut(t) * 100)
      if (t >= 1) {
        clearInterval(interval)
        setTimeout(onDone, 450)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onDone}
      className="fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-center bg-black text-white"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <AvengersA className="h-24 w-auto" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-14 h-1.5 w-[230px] overflow-hidden rounded-full bg-white/20"
      >
        <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.3, ease: "easeOut" }}
        className="mt-8 text-sm font-light tracking-wide text-white/55"
      >
        {QUOTE}
      </motion.p>

      <span className="fixed inset-x-0 bottom-6 text-center text-xs text-white/25">click anywhere to skip</span>
    </motion.div>
  )
}
