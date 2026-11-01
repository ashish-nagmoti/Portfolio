"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { showToast } from "./ios/island"

/*
 * A little life on the wallpaper, for the fan in Ashish: every 22–32 s a
 * wizard on a broomstick or an armoured hero ("I am Iron Man.") flies across
 * the desktop, taking turns, and now and then a winged golden ball darts
 * about, waiting to be caught. Original artwork, drawn here as SVG. Off in
 * Focus mode and for reduced-motion users.
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
        // Swung from the shoulder: rotating avoids morphing `d`, which can flash an invalid path
        style={{ originX: 0, originY: 0 }}
        animate={{ rotate: [0, -10, 0] }}
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
        style={{ originX: 0, originY: 1 }}
        animate={{ rotate: [0, 10, 0] }}
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

/** A red-and-gold armoured flyer, side on and facing right, boots and palms firing. */
function IronMan() {
  const flicker = { scaleX: [1, 1.35, 0.9, 1.2, 1] }
  return (
    <svg viewBox="0 0 170 70" className="h-[80px] w-[194px] overflow-visible drop-shadow-[0_6px_14px_rgba(0,0,0,0.4)]" aria-hidden>
      <defs>
        <linearGradient id="thrust" x1="1" x2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.3" stopColor="#bdf3ff" />
          <stop offset="0.65" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="armour" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e0303c" />
          <stop offset="1" stopColor="#8e0e18" />
        </linearGradient>
        <linearGradient id="gold-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#c9952a" />
        </linearGradient>
      </defs>
      {/* boot thrusters */}
      <motion.path d="M30 29 L0 26 Q-6 31 0 36 L30 34 Z" fill="url(#thrust)" style={{ originX: "30px" }} animate={flicker} transition={{ duration: 0.25, repeat: Infinity }} />
      <motion.path d="M30 38 L4 37 Q-2 41 4 45 L30 43 Z" fill="url(#thrust)" style={{ originX: "30px" }} animate={flicker} transition={{ duration: 0.22, repeat: Infinity, delay: 0.08 }} />
      {/* legs, with gold knee and shin plates */}
      <path d="M30 28 L82 25 L84 46 L30 44 Z" fill="url(#armour)" />
      <path d="M30 36 L82 35" stroke="#5e0810" strokeWidth="1.2" />
      <path d="M48 27 L60 26.4 L60 44.8 L48 44.4 Z" fill="url(#gold-plate)" opacity="0.9" />
      <rect x="27" y="27" width="5" height="18" rx="1.5" fill="#3a3a44" />
      {/* torso, gold abdomen, glowing chest reactor */}
      <path d="M80 23 Q104 18 126 24 L128 46 Q104 50 82 47 Z" fill="url(#armour)" />
      <path d="M86 25 L104 22 L104 48 L86 47 Z" fill="url(#gold-plate)" />
      <path d="M90 25 V47 M95 24 V48 M100 23 V48" stroke="#a67618" strokeWidth="0.8" />
      <circle cx="117" cy="44" r="4.5" fill="#d9fbff" style={{ filter: "drop-shadow(0 0 4px #5ee7ff)" }} />
      <circle cx="117" cy="44" r="2" fill="#ffffff" />
      {/* arm swept back along the body, palm firing */}
      <path d="M124 29 L98 42" stroke="url(#armour)" strokeWidth="8" strokeLinecap="round" />
      <path d="M104 39 L96 43" stroke="url(#gold-plate)" strokeWidth="8" strokeLinecap="round" />
      <motion.path d="M93 42 L74 50 Q70 46 74 43 Z" fill="url(#thrust)" style={{ originX: "93px" }} animate={flicker} transition={{ duration: 0.2, repeat: Infinity, delay: 0.04 }} />
      {/* helmet: red shell, gold faceplate, lit eye slit */}
      <path d="M126 28 L132 28 L132 38 L126 40 Z" fill="#6b0a12" />
      <circle cx="141" cy="31" r="11" fill="url(#armour)" />
      <path d="M141 21.5 Q153 22 153 32 Q152 41 143 42.5 Q138 36 141 21.5 Z" fill="url(#gold-plate)" />
      <path d="M145 28.5 L151.5 28" stroke="#d9fbff" strokeWidth="2" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 3px #5ee7ff)" }} />
      <path d="M146 37 L151 36.4" stroke="#8a5a12" strokeWidth="1" />
    </svg>
  )
}

/** A comic speech bubble whose tail points down at the speaker. */
function SpeechBubble({ text, tailRight }: { text: string; tailRight: boolean }) {
  return (
    <span className="relative block whitespace-nowrap rounded-[14px] border-2 border-black bg-white px-3 py-1 text-[14px] font-extrabold italic tracking-tight text-black shadow-[3px_3px_0_rgba(0,0,0,0.85)]">
      {text}
      <svg viewBox="0 0 20 14" className={`absolute -bottom-[13px] h-[14px] w-[20px] ${tailRight ? "right-4" : "left-4 -scale-x-100"}`} aria-hidden>
        <path d="M2 0 L18 0 L4 13 Z" fill="white" stroke="black" strokeWidth="2" strokeLinejoin="round" />
        <path d="M3 -1 L17 -1" stroke="white" strokeWidth="3" />
      </svg>
    </span>
  )
}

type Flyer = "wizard" | "ironman"
type Flight = { id: number; who: Flyer; leftToRight: boolean; y: number[] }
type Chase = { id: number; points: { x: number; y: number }[] }

const rand = (a: number, b: number) => a + Math.random() * (b - a)

export function Flyby({ enabled, interactive = true }: { enabled: boolean; interactive?: boolean }) {
  const reduce = useReducedMotion()
  const [flight, setFlight] = useState<Flight | null>(null)
  const [chase, setChase] = useState<Chase | null>(null)
  const ids = useRef(0)
  const on = enabled && !reduce

  // A flight every 22–32 s (the first one soon after the desktop appears),
  // the wizard and Iron Man taking turns from a random first pick
  useEffect(() => {
    if (!on) return
    let t: ReturnType<typeof setTimeout>
    let next: Flyer = Math.random() > 0.5 ? "ironman" : "wizard"
    const schedule = (delay: number) => {
      t = setTimeout(() => {
        const h = window.innerHeight
        const base = rand(0.18, 0.45) * h
        const y = next === "ironman" ? [base, base - 25, base - 60] : [base, base - 40, base + 10, base - 50]
        setFlight({ id: ++ids.current, who: next, leftToRight: Math.random() > 0.35, y })
        next = next === "ironman" ? "wizard" : "ironman"
        schedule(rand(22_000, 32_000))
      }, delay)
    }
    schedule(rand(3_000, 5_000))
    return () => clearTimeout(t)
  }, [on])

  // The golden ball, rarer: every 45–70 s, darting between random points
  useEffect(() => {
    if (!on) return
    let t: ReturnType<typeof setTimeout>
    const schedule = (delay: number) => {
      t = setTimeout(() => {
        const w = window.innerWidth
        const h = window.innerHeight
        const points = Array.from({ length: 9 }, () => ({ x: rand(0.15, 0.85) * w, y: rand(0.15, 0.7) * h }))
        setChase({ id: ++ids.current, points: [{ x: -60, y: points[0].y }, ...points, { x: w + 60, y: points[8].y }] })
        schedule(rand(45_000, 70_000))
      }, delay)
    }
    schedule(rand(12_000, 18_000))
    return () => clearTimeout(t)
  }, [on])

  if (!on) return null
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden={!interactive}>
      <AnimatePresence>
        {flight && (() => {
          const iron = flight.who === "ironman"
          const width = iron ? 194 : 128
          const duration = iron ? 9 : 11
          return (
            <motion.button
              key={flight.id}
              type="button"
              tabIndex={-1}
              aria-label={iron ? "Iron Man flying past" : "A wizard flying past"}
              onClick={() => interactive && showToast(iron ? "Jarvis, log this visit 🦾" : "Mischief managed ✨")}
              initial={{ x: flight.leftToRight ? -width - 40 : vw + 40, y: flight.y[0] }}
              animate={{
                x: flight.leftToRight ? vw + 40 : -width - 40,
                y: flight.y,
                rotate: iron ? (flight.leftToRight ? [-3, -6, -9] : [3, 6, 9]) : [-4, 3, -2, 4],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration,
                ease: "linear",
                y: { duration, ease: "easeInOut" },
                rotate: { duration },
              }}
              onAnimationComplete={() => setFlight((f) => (f?.id === flight.id ? null : f))}
              className={`absolute left-0 top-0 ${interactive ? "pointer-events-auto cursor-pointer" : ""}`}
            >
              {/* Both drawings face their direction of travel: Iron Man right, the wizard left */}
              <span className="relative block" style={{ transform: `scaleX(${flight.leftToRight === iron ? 1 : -1})` }}>
                {iron ? <IronMan /> : <Wizard />}
                {/* sparkle trail behind the broom */}
                {!iron &&
                  [0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_6px_2px_rgba(253,230,138,0.8)]"
                      style={{ left: 140 + i * 9, top: 46 + (i % 2) * 6 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.2] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
              </span>
              {iron && (
                <motion.span
                  className={`absolute -top-11 ${flight.leftToRight ? "right-[-34px]" : "left-[-34px]"}`}
                  initial={{ opacity: 0, scale: 0.4, y: 8 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.08, 1, 0.9], y: [8, 0, 0, -4] }}
                  transition={{ duration: duration * 0.75, times: [0, 0.12, 0.85, 1], delay: duration * 0.08 }}
                >
                  <SpeechBubble text="I am Iron Man." tailRight={flight.leftToRight} />
                </motion.span>
              )}
            </motion.button>
          )
        })()}
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
