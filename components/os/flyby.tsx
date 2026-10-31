"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { showToast } from "./ios/island"

/*
 * A little life on the wallpaper, for the fan in Ashish: every minute or so
 * a wizard on a broomstick flies across the desktop, and now and then a
 * winged golden ball darts about, waiting to be caught. Original artwork,
 * drawn here as SVG. Off in Focus mode and for reduced-motion users.
 */

function Wizard() {
  return (
    <svg viewBox="0 0 160 90" className="h-[72px] w-[128px] overflow-visible drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]" aria-hidden>
      {/* broom: handle and bristles */}
      <path d="M10 60 L120 52" stroke="#6b4423" strokeWidth="4" strokeLinecap="round" />
      <path d="M118 46 L150 40 L152 66 L120 58 Z" fill="#c9a24a" />
      <path d="M124 49 L148 45 M124 55 L150 54 M124 52 L149 50" stroke="#8a6a24" strokeWidth="1.2" />
      {/* cape, streaming behind */}
      <motion.path
        d="M58 30 Q90 28 112 44 Q96 48 74 56 Z"
        fill="#1b1f3a"
        animate={{ d: ["M58 30 Q90 28 112 44 Q96 48 74 56 Z", "M58 30 Q92 22 116 36 Q98 46 74 56 Z", "M58 30 Q90 28 112 44 Q96 48 74 56 Z"] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* body, leg and arm */}
      <path d="M52 28 Q62 24 68 32 L72 56 L54 58 Z" fill="#232848" />
      <path d="M58 56 L44 66 L48 70 L64 60 Z" fill="#232848" />
      <path d="M54 36 L40 54" stroke="#232848" strokeWidth="6" strokeLinecap="round" />
      {/* striped scarf, flying back */}
      <motion.path
        d="M56 26 Q74 22 86 18"
        stroke="url(#scarf)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        animate={{ d: ["M56 26 Q74 22 86 18", "M56 26 Q74 28 88 24", "M56 26 Q74 22 86 18"] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* head, messy hair, round glasses */}
      <circle cx="52" cy="18" r="9" fill="#f1c9a5" />
      <path d="M43 16 Q46 6 55 8 Q62 9 61 15 Q57 11 52 13 Q47 12 43 16 Z" fill="#1a1410" />
      <circle cx="49" cy="19" r="2.6" fill="none" stroke="#111" strokeWidth="1" />
      <circle cx="55" cy="19" r="2.6" fill="none" stroke="#111" strokeWidth="1" />
      <path d="M51.6 19 H52.4" stroke="#111" strokeWidth="1" />
      <defs>
        <linearGradient id="scarf" x1="0" x2="1">
          <stop offset="0" stopColor="#7f0909" />
          <stop offset="0.25" stopColor="#d3a625" />
          <stop offset="0.5" stopColor="#7f0909" />
          <stop offset="0.75" stopColor="#d3a625" />
          <stop offset="1" stopColor="#7f0909" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function GoldenBall() {
  return (
    <svg viewBox="0 0 60 30" className="h-[26px] w-[52px] overflow-visible drop-shadow-[0_0_10px_rgba(255,214,90,0.8)]" aria-hidden>
      <motion.ellipse
        cx="14" cy="13" rx="13" ry="6" fill="rgba(255,255,255,0.75)" stroke="rgba(200,170,90,0.6)" strokeWidth="0.6"
        style={{ originX: "28px", originY: "15px" }}
        animate={{ rotate: [-25, 25, -25] }}
        transition={{ duration: 0.12, repeat: Infinity }}
      />
      <motion.ellipse
        cx="46" cy="13" rx="13" ry="6" fill="rgba(255,255,255,0.75)" stroke="rgba(200,170,90,0.6)" strokeWidth="0.6"
        style={{ originX: "32px", originY: "15px" }}
        animate={{ rotate: [25, -25, 25] }}
        transition={{ duration: 0.12, repeat: Infinity }}
      />
      <circle cx="30" cy="16" r="7" fill="url(#gold)" />
      <path d="M25 13 Q30 18 35 13" stroke="#a87b12" strokeWidth="0.7" fill="none" />
      <defs>
        <radialGradient id="gold" cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.5" stopColor="#f2c230" />
          <stop offset="1" stopColor="#b8860b" />
        </radialGradient>
      </defs>
    </svg>
  )
}

type Flight = { id: number; leftToRight: boolean; y: number[] }
type Chase = { id: number; points: { x: number; y: number }[] }

const rand = (a: number, b: number) => a + Math.random() * (b - a)

export function Flyby({ enabled, interactive = true }: { enabled: boolean; interactive?: boolean }) {
  const reduce = useReducedMotion()
  const [flight, setFlight] = useState<Flight | null>(null)
  const [chase, setChase] = useState<Chase | null>(null)
  const ids = useRef(0)
  const on = enabled && !reduce

  // A flight every 45–75 s (the first one soon after the desktop appears)
  useEffect(() => {
    if (!on) return
    let t: ReturnType<typeof setTimeout>
    const schedule = (delay: number) => {
      t = setTimeout(() => {
        const h = window.innerHeight
        const base = rand(0.18, 0.45) * h
        setFlight({ id: ++ids.current, leftToRight: Math.random() > 0.35, y: [base, base - 40, base + 10, base - 50] })
        schedule(rand(45_000, 75_000))
      }, delay)
    }
    schedule(rand(6_000, 10_000))
    return () => clearTimeout(t)
  }, [on])

  // The golden ball, rarer: every 80–140 s, darting between random points
  useEffect(() => {
    if (!on) return
    let t: ReturnType<typeof setTimeout>
    const schedule = (delay: number) => {
      t = setTimeout(() => {
        const w = window.innerWidth
        const h = window.innerHeight
        const points = Array.from({ length: 9 }, () => ({ x: rand(0.15, 0.85) * w, y: rand(0.15, 0.7) * h }))
        setChase({ id: ++ids.current, points: [{ x: -60, y: points[0].y }, ...points, { x: w + 60, y: points[8].y }] })
        schedule(rand(80_000, 140_000))
      }, delay)
    }
    schedule(rand(25_000, 40_000))
    return () => clearTimeout(t)
  }, [on])

  if (!on) return null
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden={!interactive}>
      <AnimatePresence>
        {flight && (
          <motion.button
            key={flight.id}
            type="button"
            tabIndex={-1}
            aria-label="A wizard flying past"
            onClick={() => interactive && showToast("Mischief managed ✨")}
            initial={{ x: flight.leftToRight ? -160 : vw + 40, y: flight.y[0] }}
            animate={{
              x: flight.leftToRight ? vw + 40 : -160,
              y: flight.y,
              rotate: [-4, 3, -2, 4],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 11, ease: "linear", y: { duration: 11, ease: "easeInOut" }, rotate: { duration: 11 } }}
            onAnimationComplete={() => setFlight((f) => (f?.id === flight.id ? null : f))}
            style={{ scaleX: flight.leftToRight ? 1 : -1 }}
            className={`absolute left-0 top-0 ${interactive ? "pointer-events-auto cursor-pointer" : ""}`}
          >
            <Wizard />
            {/* sparkle trail */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_6px_2px_rgba(253,230,138,0.8)]"
                style={{ left: 140 + i * 9, top: 46 + (i % 2) * 6 }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.2] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chase && (
          <motion.button
            key={chase.id}
            type="button"
            tabIndex={-1}
            aria-label="A golden ball, catch it"
            onClick={() => {
              if (!interactive) return
              showToast("Caught it! +150 🏆")
              setChase(null)
            }}
            initial={{ x: chase.points[0].x, y: chase.points[0].y, scale: 1 }}
            animate={{ x: chase.points.map((p) => p.x), y: chase.points.map((p) => p.y) }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 13, ease: "easeInOut" }}
            onAnimationComplete={() => setChase((c) => (c?.id === chase.id ? null : c))}
            className={`absolute left-0 top-0 p-3 ${interactive ? "pointer-events-auto cursor-pointer" : ""}`}
          >
            <GoldenBall />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
