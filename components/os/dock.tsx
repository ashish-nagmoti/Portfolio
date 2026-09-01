"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimation,
  AnimatePresence,
  type MotionValue,
} from "framer-motion"
import { APPS, APP_ORDER, RESUME_ICON } from "./app-registry"
import type { AppId, OpenWindow } from "./types"
import { cn } from "@/lib/utils"

const BASE = 46
const MAX = 76
const DISTANCE = 130

function DockIcon({
  mouseX,
  onClick,
  label,
  isOpen,
  bounceToken,
  children,
}: {
  mouseX: MotionValue<number>
  onClick: (rect?: DOMRect) => void
  label: string
  isOpen: boolean
  bounceToken?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const controls = useAnimation()

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return DISTANCE
    return val - (rect.left + rect.width / 2)
  })
  const widthSync = useTransform(distance, [-DISTANCE, 0, DISTANCE], [BASE, MAX, BASE])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 250, damping: 16 })
  const iconSize = useTransform(width, (w) => w * 0.52)

  useEffect(() => {
    if (bounceToken) {
      controls.start({ y: [0, -20, 0, -8, 0], transition: { duration: 0.55, ease: "easeOut" } })
    }
  }, [bounceToken, controls])

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="absolute -top-9 whitespace-nowrap rounded-lg bg-black/80 dark:bg-white/90 text-white dark:text-black text-xs font-medium px-2.5 py-1 pointer-events-none"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        animate={controls}
        onClick={() => onClick(ref.current?.getBoundingClientRect())}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center"
        aria-label={label}
      >
        {children}
      </motion.button>
      <span
        className={cn(
          "mt-1 w-1 h-1 rounded-full transition-opacity",
          isOpen ? "bg-foreground/70 opacity-100" : "opacity-0",
        )}
      />
    </div>
  )
}

interface DockProps {
  openWindows: OpenWindow[]
  onOpen: (id: AppId, rect?: DOMRect) => void
  bounceId?: AppId | null
  bounceToken?: number
}

export function Dock({ openWindows, onOpen, bounceId, bounceToken }: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <div className="fixed bottom-2 inset-x-0 z-[9000] flex justify-center pointer-events-none px-2">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.15 }}
        className="pointer-events-auto flex items-end gap-2.5 px-3 pb-2 pt-2 rounded-[26px] bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl"
      >
        {APP_ORDER.map((id) => {
          const app = APPS[id]
          return (
            <DockIcon
              key={id}
              mouseX={mouseX}
              onClick={(rect) => onOpen(id, rect)}
              label={app.title}
              isOpen={openWindows.some((w) => w.id === id)}
              bounceToken={bounceId === id ? bounceToken : undefined}
            >
              <span className={cn("w-full h-full rounded-[22%] flex items-center justify-center shadow-sm", app.accent)}>
                <app.icon className="h-1/2 w-1/2" />
              </span>
            </DockIcon>
          )
        })}

        <div className="w-px h-11 bg-black/10 dark:bg-white/15 self-center mx-0.5" />

        <DockIcon mouseX={mouseX} onClick={() => window.open(RESUME_ICON.href, "_blank")} label={RESUME_ICON.title} isOpen={false}>
          <span className={cn("w-full h-full rounded-[22%] flex items-center justify-center shadow-sm", RESUME_ICON.accent)}>
            <RESUME_ICON.icon className="h-1/2 w-1/2" />
          </span>
        </DockIcon>
      </motion.div>
    </div>
  )
}
