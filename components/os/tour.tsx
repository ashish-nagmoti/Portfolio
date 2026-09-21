"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Paperclip, ChevronLeft, ChevronRight, X } from "lucide-react"
import type { AppId } from "./types"
import { cn } from "@/lib/utils"

export const TOUR_DONE_KEY = "os-tour-done"

type Placement = "top" | "bottom" | "left" | "right" | "center"

interface Step {
  /** `data-tour` value of the element to spotlight; none for a centred step. */
  target?: string
  placement: Placement
  title: string
  body: string
  /** App to open when this step starts, so the step can point at a live window. */
  opens?: AppId
}

const STEPS: Step[] = [
  {
    placement: "center",
    title: "Hi, I'm Clip.",
    body: "This portfolio works like a Mac desktop. Want a 30-second tour of where everything is?",
  },
  {
    target: "dock",
    placement: "top",
    title: "The Dock",
    body: "Every app lives here: About, Projects, Terminal, Contact, Blog, Interests — and my resume on the end. Hover to magnify, click to open.",
  },
  {
    target: "widgets",
    placement: "left",
    title: "Widgets",
    body: "What I'm working on, my stack, stats and a featured project. Drag any widget anywhere — the desktop remembers where you left it.",
  },
  {
    target: "window",
    placement: "right",
    opens: "about",
    title: "Windows",
    body: "I've opened About for you. Drag it by the title bar, resize from the corner, and the traffic lights close, minimise and maximise.",
  },
  {
    target: "spotlight",
    placement: "bottom",
    title: "Spotlight",
    body: "Press ⌘K (or Ctrl+K) anywhere to search and jump straight to an app. It's the fastest way around.",
  },
  {
    target: "menubar",
    placement: "bottom",
    title: "The menu bar",
    body: "File has my resume and llms.txt, View switches dark mode, Help has the shortcuts, and  can restart the desktop. Right-click the wallpaper for more.",
  },
  {
    placement: "center",
    title: "That's the tour.",
    body: "Everything else is just a Mac. Replay this any time from Help → Take the Tour. Enjoy the desktop!",
  },
]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const PAD = 8 // breathing room around a spotlit element
const BUBBLE_W = 340
const GAP = 14

function measure(target?: string): Rect | null {
  if (!target) return null
  const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (r.width === 0 && r.height === 0) return null
  return { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 }
}

/** Where the bubble goes for a step, clamped to the viewport. */
function bubblePosition(placement: Placement, rect: Rect | null): { top?: number; bottom?: number; left?: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const clampX = (x: number) => Math.min(Math.max(12, x), vw - BUBBLE_W - 12)

  if (!rect || placement === "center") {
    return { top: Math.round(vh * 0.36), left: clampX((vw - BUBBLE_W) / 2) }
  }
  const cx = rect.left + rect.width / 2
  switch (placement) {
    case "top":
      return { bottom: vh - rect.top + GAP, left: clampX(cx - BUBBLE_W / 2) }
    case "bottom":
      return { top: rect.top + rect.height + GAP, left: clampX(cx - BUBBLE_W / 2) }
    case "left":
      return { top: Math.max(12, rect.top), left: clampX(rect.left - BUBBLE_W - GAP) }
    case "right":
      return { top: Math.max(12, rect.top + rect.height / 2 - 90), left: clampX(rect.left + rect.width + GAP) }
  }
}

interface TourProps {
  open: boolean
  onClose: () => void
  onOpenApp: (id: AppId) => void
}

/**
 * A Clippy-style guided tour: a paperclip mascot with a speech bubble that
 * spotlights one part of the desktop at a time. Skippable at every step;
 * arrow keys and Enter move between steps. The dimmed backdrop doesn't block
 * clicks, so the spotlit thing can be tried while it's being explained.
 */
export function Tour({ open, onClose, onOpenApp }: TourProps) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const current = STEPS[step]
  const last = step === STEPS.length - 1

  // Start from the top whenever the tour is (re)opened.
  useEffect(() => {
    if (open) setStep(0)
  }, [open])

  // A step that opens an app does so once, on entry.
  useEffect(() => {
    if (open && current.opens) onOpenApp(current.opens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step])

  // Measure the target, and keep measuring briefly: a window opened for this
  // step is still animating in, and a magnifying dock icon settles over time.
  const remeasure = useCallback(() => setRect(measure(current.target)), [current.target])
  useLayoutEffect(() => {
    if (!open) return
    remeasure()
    const timers = [120, 320, 700, 1200].map((ms) => setTimeout(remeasure, ms))
    window.addEventListener("resize", remeasure)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener("resize", remeasure)
    }
  }, [open, remeasure])

  const next = useCallback(() => (last ? onClose() : setStep((s) => s + 1)), [last, onClose])
  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault()
        next()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        back()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, next, back])

  const pos = open ? bubblePosition(current.placement, rect) : {}

  return (
    <AnimatePresence>
      {open && (
        <div className="pointer-events-none fixed inset-0 z-[9900]" aria-live="polite">
          {/* Spotlight: the ring's giant shadow dims everything but the target. */}
          <motion.div
            key="spot"
            initial={false}
            animate={
              rect
                ? { opacity: 1, top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                : { opacity: 1, top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 }
            }
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={cn(
              "absolute rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]",
              rect && "ring-2 ring-white/80 dark:ring-white/70",
            )}
          />

          {/* Mascot + speech bubble */}
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, ...pos }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{ width: BUBBLE_W }}
            className="pointer-events-auto absolute flex items-end gap-3"
            role="dialog"
            aria-label={`Tour step ${step + 1} of ${STEPS.length}: ${current.title}`}
          >
            <motion.div
              key={`clip-${step}`}
              animate={{ rotate: [0, -14, 10, -6, 0], y: [0, -6, 0] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-300 to-orange-500 shadow-lg ring-2 ring-white/60"
              aria-hidden
            >
              <Paperclip className="h-6 w-6 text-white drop-shadow" strokeWidth={2.5} />
            </motion.div>

            <div className="relative min-w-0 flex-1 rounded-2xl border border-black/5 bg-white/95 p-4 text-foreground shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#2a2a30]/95">
              {/* Tail pointing at the mascot */}
              <span className="absolute -left-1.5 bottom-4 h-3 w-3 rotate-45 border-b border-l border-black/5 bg-white/95 dark:border-white/10 dark:bg-[#2a2a30]/95" />
              <button
                onClick={onClose}
                aria-label="Skip tour"
                className="absolute right-2.5 top-2.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Clip · {step + 1} / {STEPS.length}
              </p>
              <p className="mt-1 pr-5 text-sm font-semibold">{current.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{current.body}</p>

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Skip tour
                </button>
                <div className="flex items-center gap-1.5">
                  {step > 0 && (
                    <button
                      onClick={back}
                      aria-label="Back"
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  >
                    {step === 0 ? "Start tour" : last ? "Finish" : "Next"}
                    {!last && <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
