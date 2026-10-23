"use client"

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { motion, useDragControls, useMotionValue, useTransform } from "framer-motion"
import { CaretLeft } from "@phosphor-icons/react"
import { APPS } from "./app-registry"
import { CompactContext } from "./window-context"
import type { AppId } from "./types"
import { cn } from "@/lib/utils"

const MIN_WIDTH = 340
const MIN_HEIGHT = 280

// The three title-bar buttons, drawn the way macOS draws them: a coloured
// disc with a slightly darker rim, glyphs that appear together when the
// pointer is over any of them, and plain grey discs on a background window.
const LIGHTS = {
  close: { fill: "#ff5f57", rim: "#e0443e", glyph: "M3.5 3.5l5 5M8.5 3.5l-5 5", label: "Close" },
  minimize: { fill: "#febc2e", rim: "#dea123", glyph: "M3 6h6", label: "Minimize" },
  zoom: { fill: "#28c840", rim: "#1aab29", glyph: "", label: "Zoom" },
} as const

function TrafficLight({ kind, active, onClick }: { kind: keyof typeof LIGHTS; active: boolean; onClick: () => void }) {
  const l = LIGHTS[kind]
  return (
    <button
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      aria-label={l.label}
      className="relative h-3 w-3 rounded-full focus-visible:outline-offset-1"
      style={
        active
          ? { background: l.fill, boxShadow: `inset 0 0 0 0.5px ${l.rim}` }
          : undefined
      }
    >
      {!active && (
        <span className="absolute inset-0 rounded-full bg-black/[0.13] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.08)] group-hover/lights:hidden dark:bg-white/[0.16]" />
      )}
      {/* On hover every light shows its colour and glyph, even on a background window */}
      <span
        className="absolute inset-0 hidden rounded-full group-hover/lights:block"
        style={{ background: l.fill, boxShadow: `inset 0 0 0 0.5px ${l.rim}` }}
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
          {kind === "zoom" ? (
            // Two opposing corner arrows, the full-screen glyph
            <path d="M3.4 3.4h3.7L3.4 7.1zM8.6 8.6H4.9l3.7-3.7z" fill="rgba(0,0,0,0.55)" />
          ) : (
            <path d={l.glyph} stroke="rgba(0,0,0,0.55)" strokeWidth={1.25} strokeLinecap="round" fill="none" />
          )}
        </svg>
      </span>
    </button>
  )
}

export interface OriginRect {
  top: number
  left: number
  width: number
  height: number
}

interface WindowProps {
  appId: AppId
  zIndex: number
  minimized: boolean
  maximized: boolean
  isMobile: boolean
  isFocused: boolean
  pos: { x: number; y: number }
  size: { width: number; height: number }
  originRect?: OriginRect | null
  onClose: () => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onFocus: () => void
  onResize: (size: { width: number; height: number }) => void
  onMove: (pos: { x: number; y: number }) => void
}

export function Window({
  appId,
  zIndex,
  minimized,
  maximized,
  isMobile,
  isFocused,
  pos,
  size,
  originRect,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onResize,
  onMove,
}: WindowProps) {
  const app = APPS[appId]
  const dragControls = useDragControls()
  const Content = app.Content
  const sizeRef = useRef(size)
  sizeRef.current = size
  // Phone: the icon this window opened from, fixed at mount (the prop moves on with later opens)
  const mobileOriginRef = useRef(originRect)
  // Phone: how far the app's content has scrolled (whichever element inside
  // it scrolls; scroll events don't bubble, so listen in the capture phase),
  // driving the iOS large title as it collapses into the navigation bar.
  const mobileBodyRef = useRef<HTMLDivElement>(null)
  const contentScroll = useMotionValue(0)
  useEffect(() => {
    const el = mobileBodyRef.current
    if (!isMobile || !el) return
    const onScroll = (e: Event) => contentScroll.set((e.target as HTMLElement).scrollTop ?? 0)
    el.addEventListener("scroll", onScroll, true)
    return () => el.removeEventListener("scroll", onScroll, true)
  }, [isMobile, contentScroll])
  const largeTitleHeight = useTransform(contentScroll, [0, 52], [52, 0], { clamp: true })
  const largeTitleOpacity = useTransform(contentScroll, [0, 32], [1, 0], { clamp: true })
  const largeTitleScale = useTransform(contentScroll, [-80, 0], [1.08, 1], { clamp: true })
  const barOpacity = useTransform(contentScroll, [30, 52], [0, 1], { clamp: true })
  const swipeX = useMotionValue(0)
  const [swipedAway, setSwipedAway] = useState(false)

  // Dragging moves the window with a transform. When a drag ends the offset
  // is folded into `pos` and the transform reset in the same frame, so zoom,
  // the minimize animation and resize limits all work from where it really is.
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  useLayoutEffect(() => {
    dragX.set(0)
    dragY.set(0)
  }, [pos.x, pos.y, dragX, dragY])
  const endDrag = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Keep at least part of the title bar reachable
    const x = Math.min(Math.max(pos.x + dragX.get(), 80 - sizeRef.current.width), vw - 80)
    const y = Math.min(Math.max(pos.y + dragY.get(), 32), vh - 60)
    const next = { x: Math.round(x), y: Math.round(y) }
    if (next.x === pos.x && next.y === pos.y) {
      // Clamped straight back to where it started: no re-render to reset on
      dragX.set(0)
      dragY.set(0)
    } else onMove(next)
  }

  if (isMobile) {
    // Phone: the app fills the screen, growing out of the icon that was tapped
    // (a clip-path reveal, so the content never re-lays out mid-animation) and
    // shrinking back into it on close; or, after a swipe back, sliding away.
    const vw = window.innerWidth
    const vh = window.innerHeight
    const o = mobileOriginRef.current ?? { top: vh * 0.4, left: vw * 0.4, width: vw * 0.2, height: vw * 0.2 }
    const fromIcon = `inset(${o.top}px ${vw - o.left - o.width}px ${vh - o.top - o.height}px ${o.left}px round 15px)`
    const ease = [0.32, 0.72, 0, 1] as const
    const shortTitle = app.title.replace(/\.(txt|app)$|\/$/, "")

    return (
      <motion.div
        initial={{ clipPath: fromIcon, opacity: 0.6 }}
        animate={{ clipPath: "inset(0px 0px 0px 0px round 0px)", opacity: 1 }}
        exit={
          swipedAway
            ? { x: vw, transition: { duration: 0.25, ease } }
            : { clipPath: fromIcon, opacity: 0, transition: { duration: 0.3, ease } }
        }
        transition={{ duration: 0.45, ease }}
        drag="x"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 1 }}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.x > vw * 0.3 || info.velocity.x > 500) {
            setSwipedAway(true)
            onClose()
          }
        }}
        style={{ position: "fixed", inset: 0, zIndex, x: swipeX }}
        role="dialog"
        aria-label={shortTitle}
        className="flex flex-col bg-background shadow-[-16px_0_40px_rgba(0,0,0,0.25)]"
      >
        {/* Swipe in from the left edge to go back, as in any iOS app */}
        <div
          aria-hidden
          onPointerDown={(e) => {
            e.preventDefault() // no text selection while swiping
            dragControls.start(e)
          }}
          className="absolute inset-y-0 left-0 z-20 w-5 touch-none select-none"
        />

        {/* iOS navigation bar: the small title fades in once the large one scrolls away */}
        <div className="relative z-10 shrink-0 pt-[env(safe-area-inset-top)]">
          <motion.div
            style={{ opacity: barOpacity }}
            className="absolute inset-0 border-b border-black/[0.08] bg-background/85 backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.08]"
          />
          <div className="relative flex h-11 items-center justify-center px-2">
            <button
              onClick={onClose}
              className="absolute left-1 flex h-11 items-center gap-0.5 rounded-lg pl-1 pr-3 text-[17px] text-primary active:opacity-50"
              aria-label="Back to Home"
            >
              <CaretLeft weight="bold" className="h-[22px] w-[22px]" />
              Home
            </button>
            <motion.span style={{ opacity: barOpacity }} className="max-w-[55%] truncate text-[17px] font-semibold">
              {shortTitle}
            </motion.span>
          </div>
        </div>
        {/* Large title, collapsing as the app's content scrolls */}
        <motion.div style={{ height: largeTitleHeight }} className="shrink-0 overflow-hidden px-4">
          <motion.h1
            style={{ opacity: largeTitleOpacity, scale: largeTitleScale }}
            className="origin-left pb-1 pt-0.5 text-[34px] font-bold leading-[1.15] tracking-[-0.02em]"
          >
            {shortTitle}
          </motion.h1>
        </motion.div>
        <div
          ref={mobileBodyRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background pb-[env(safe-area-inset-bottom)] [-webkit-overflow-scrolling:touch]"
        >
          <CompactContext.Provider value={true}>
            <Content />
          </CompactContext.Provider>
        </div>
      </motion.div>
    )
  }

  const startResize = (e: ReactPointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onFocus()
    const startX = e.clientX
    const startY = e.clientY
    const startW = sizeRef.current.width
    const startH = sizeRef.current.height
    const maxW = window.innerWidth - pos.x - 20
    const maxH = window.innerHeight - pos.y - 100

    const onMove = (ev: PointerEvent) => {
      const width = Math.min(Math.max(startW + (ev.clientX - startX), MIN_WIDTH), maxW)
      const height = Math.min(Math.max(startH + (ev.clientY - startY), MIN_HEIGHT), maxH)
      onResize({ width, height })
    }
    const onUp = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  const style = maximized
    ? { top: 32, left: 8, right: 8, bottom: 88, zIndex }
    : { top: pos.y, left: pos.x, width: size.width, height: size.height, zIndex }

  // "Genie" effect: shrink and slide toward the dock (bottom-center) when minimized,
  // instead of instantly vanishing. The window stays mounted so it can pop back open.
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280
  const vh = typeof window !== "undefined" ? window.innerHeight : 800
  const dockOffsetX = vw / 2 - pos.x - size.width / 2
  const dockOffsetY = vh - pos.y - 40

  return (
    <motion.div
      drag={!maximized && !minimized}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={endDrag}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.92, x: 0, y: 0 }}
      animate={
        minimized
          ? { opacity: 0, scale: 0.05, x: dockOffsetX, y: dockOffsetY }
          : { opacity: 1, scale: 1, x: 0, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      style={{ position: "absolute", x: dragX, y: dragY, pointerEvents: minimized ? "none" : "auto", ...style }}
      aria-hidden={minimized}
      data-tour={isFocused ? "window" : undefined}
      className={cn(
        "flex flex-col overflow-hidden rounded-[13px] bg-card ring-1 transition-shadow duration-300",
        isFocused
          ? "shadow-[0_0_0_0.5px_rgba(0,0,0,0.12),0_30px_80px_-10px_rgba(0,0,0,0.42),0_10px_24px_-6px_rgba(0,0,0,0.22)] ring-black/[0.12] dark:shadow-[0_30px_90px_-6px_rgba(0,0,0,0.7),0_12px_28px_-6px_rgba(0,0,0,0.5)] dark:ring-white/[0.13]"
          : "shadow-[0_16px_40px_-12px_rgba(0,0,0,0.28),0_4px_12px_-4px_rgba(0,0,0,0.14)] ring-black/[0.08] dark:shadow-[0_16px_44px_-10px_rgba(0,0,0,0.55)] dark:ring-white/[0.08]",
      )}
    >
      {/* Dark-mode windows catch a hairline of light along the top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent dark:block" />
      <div
        onPointerDown={(e) => !maximized && dragControls.start(e)}
        // Double-clicking a title bar zooms the window, as on macOS
        onDoubleClick={onToggleMaximize}
        className={cn(
          "relative flex h-[38px] shrink-0 select-none items-center justify-center border-b px-3.5 backdrop-blur-xl transition-colors duration-200",
          isFocused
            ? "border-black/[0.08] bg-[#f6f6f6]/90 dark:border-black/40 dark:bg-[#323236]/90"
            : "border-black/[0.06] bg-[#ececec]/90 dark:border-black/30 dark:bg-[#2a2a2d]/90",
        )}
      >
        <div className="absolute left-3.5 flex gap-2 group/lights">
          <TrafficLight kind="close" active={isFocused} onClick={onClose} />
          <TrafficLight kind="minimize" active={isFocused} onClick={onMinimize} />
          <TrafficLight kind="zoom" active={isFocused} onClick={onToggleMaximize} />
        </div>
        <span
          className={cn(
            "pointer-events-none max-w-[60%] truncate text-[13px] font-semibold tracking-[-0.01em] transition-colors",
            isFocused ? "text-foreground/85" : "text-foreground/35",
          )}
        >
          {app.title}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background">
        <CompactContext.Provider value={!maximized && size.width < 560}>
          <Content />
        </CompactContext.Provider>
      </div>
      {!maximized && (
        <div
          onPointerDown={startResize}
          className="absolute bottom-0.5 right-0.5 w-5 h-5 cursor-nwse-resize touch-none grid grid-cols-2 gap-[3px] place-content-end p-1"
          aria-label="Resize"
        >
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40 col-start-2" />
        </div>
      )}
    </motion.div>
  )
}
