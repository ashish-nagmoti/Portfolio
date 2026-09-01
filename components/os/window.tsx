"use client"

import { useRef, type PointerEvent as ReactPointerEvent } from "react"
import { motion, useDragControls, AnimatePresence } from "framer-motion"
import { X, Minus, Square } from "lucide-react"
import { APPS } from "./app-registry"
import { STATUS_BAR_HEIGHT } from "./ios/status-bar"
import type { AppId } from "./types"
import { cn } from "@/lib/utils"

const MIN_WIDTH = 340
const MIN_HEIGHT = 280

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
}: WindowProps) {
  const app = APPS[appId]
  const dragControls = useDragControls()
  const Content = app.Content
  const sizeRef = useRef(size)
  sizeRef.current = size

  if (isMobile) {
    const vw = typeof window !== "undefined" ? window.innerWidth : 390
    const vh = typeof window !== "undefined" ? window.innerHeight : 844
    const origin = originRect ?? { top: vh - 90, left: vw / 2 - 28, width: 56, height: 56 }

    return (
      <AnimatePresence>
        <motion.div
          key={appId}
          initial={{
            top: origin.top,
            left: origin.left,
            width: origin.width,
            height: origin.height,
            borderRadius: 22,
            opacity: 0.4,
          }}
          animate={{ top: 0, left: 0, width: vw, height: vh, borderRadius: 0, opacity: 1 }}
          exit={{ top: origin.top, left: origin.left, width: origin.width, height: origin.height, borderRadius: 22, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          style={{ position: "fixed", zIndex }}
          className="bg-background flex flex-col overflow-hidden"
        >
          <div
            className="flex items-center justify-between px-4 pb-3 bg-card shadow-sm border-b border-black/5 dark:border-white/10 shrink-0"
            style={{ paddingTop: STATUS_BAR_HEIGHT - 12 }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn("p-1.5 rounded-[22%] shrink-0", app.accent)}>
                <app.icon className="h-4 w-4" />
              </span>
              <span className="font-semibold truncate">{app.title}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <Content />
          </div>
          <motion.button
            onClick={onClose}
            drag="y"
            dragConstraints={{ top: -50, bottom: 0 }}
            dragElastic={{ top: 0.4, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -28 || info.velocity.y < -400) onClose()
            }}
            aria-label="Close (swipe up for home)"
            className="absolute bottom-1.5 inset-x-0 mx-auto w-32 h-1.5 rounded-full bg-foreground/30 touch-none"
          />
        </motion.div>
      </AnimatePresence>
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
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.92, x: 0, y: 0 }}
      animate={
        minimized
          ? { opacity: 0, scale: 0.05, x: dockOffsetX, y: dockOffsetY }
          : { opacity: 1, scale: 1, x: 0, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      style={{ position: "absolute", pointerEvents: minimized ? "none" : "auto", ...style }}
      aria-hidden={minimized}
      className={cn(
        "rounded-xl bg-card flex flex-col overflow-hidden border",
        isFocused ? "shadow-2xl border-black/10 dark:border-white/10" : "shadow-lg border-black/5 dark:border-white/5",
      )}
    >
      <div
        onPointerDown={(e) => !maximized && dragControls.start(e)}
        className={cn(
          "relative flex items-center justify-center h-9 px-3.5 shrink-0 bg-white/80 dark:bg-[#2b2b30]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/10",
          !maximized && "cursor-move",
        )}
      >
        <div className="absolute left-3.5 flex gap-2 group/lights">
          <button
            onClick={onClose}
            className={cn(
              "w-3 h-3 rounded-full flex items-center justify-center transition-colors",
              isFocused ? "bg-[#ff5f57]" : "bg-foreground/20",
            )}
            aria-label="Close"
          >
            <X className="h-1.5 w-1.5 text-black/50 opacity-0 group-hover/lights:opacity-100" />
          </button>
          <button
            onClick={onMinimize}
            className={cn(
              "w-3 h-3 rounded-full flex items-center justify-center transition-colors",
              isFocused ? "bg-[#febc2e]" : "bg-foreground/20",
            )}
            aria-label="Minimize"
          >
            <Minus className="h-1.5 w-1.5 text-black/50 opacity-0 group-hover/lights:opacity-100" />
          </button>
          <button
            onClick={onToggleMaximize}
            className={cn(
              "w-3 h-3 rounded-full flex items-center justify-center transition-colors",
              isFocused ? "bg-[#28c840]" : "bg-foreground/20",
            )}
            aria-label="Maximize"
          >
            <Square className="h-1.5 w-1.5 text-black/50 opacity-0 group-hover/lights:opacity-100" />
          </button>
        </div>
        <span className={cn("text-[13px] font-medium select-none", isFocused ? "text-foreground/80" : "text-foreground/40")}>
          {app.title}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <Content />
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
