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
// Icons magnify with a transform rather than by growing their box, so the dock
// background never changes size. The falloff is deliberately tight: only the
// icon under the pointer really pops, which keeps neighbours from crowding it.
const MAX_SCALE = 1.65
const DISTANCE = 80
const MAGNIFY_SPRING = { mass: 0.05, stiffness: 520, damping: 20 }

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
  const scaleSync = useTransform(distance, [-DISTANCE, 0, DISTANCE], [1, MAX_SCALE, 1])
  const scale = useSpring(scaleSync, MAGNIFY_SPRING)

  useEffect(() => {
    if (bounceToken) {
      controls.start({ y: [0, -20, 0, -8, 0], transition: { duration: 0.55, ease: "easeOut" } })
    }
  }, [bounceToken, controls])

  return (
    <div className={cn("relative flex flex-col items-center", hovered && "z-10")}>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            // Clears the magnified icon, which grows upward past the dock.
            className="absolute -top-14 whitespace-nowrap rounded-lg bg-black/80 dark:bg-white/90 text-white dark:text-black text-xs font-medium px-2.5 py-1 pointer-events-none"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        ref={ref}
        style={{ width: BASE, height: BASE }}
        animate={controls}
        onClick={() => onClick(ref.current?.getBoundingClientRect())}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center"
        aria-label={label}
      >
        {/* flex, not block: the icon child is a <span>, which needs blockifying for h/w-full to apply */}
        <motion.span style={{ scale, transformOrigin: "bottom center" }} className="flex h-full w-full">
          {children}
        </motion.span>
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
        // A plain tray: it never reacts to hover, and because icons magnify
        // with a transform it never changes size either.
        // Plain translucent tray, no backdrop-filter: re-blurring the backdrop
        // behind seven icons that magnify every frame is far too expensive.
        className="pointer-events-auto flex items-end gap-3.5 rounded-[26px] border border-white/60 bg-white/60 px-3 pb-2 pt-2 shadow-xl dark:border-white/10 dark:bg-white/[0.14]"
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
              <span className="relative w-full h-full rounded-[22%] shadow-md">
                <span className={cn("squircle absolute inset-0 flex items-center justify-center", app.accent)}>
                  <span className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent" />
                  <app.icon
                    className={cn("relative h-1/2 w-1/2 drop-shadow-sm", app.iconClassName ?? "text-white")}
                    strokeWidth={2.25}
                  />
                </span>
              </span>
            </DockIcon>
          )
        })}

        <div className="w-px h-11 bg-black/10 dark:bg-white/15 self-center mx-0.5" />

        <DockIcon mouseX={mouseX} onClick={() => window.open(RESUME_ICON.href, "_blank")} label={RESUME_ICON.title} isOpen={false}>
          <span className="relative w-full h-full rounded-[22%] shadow-md">
            <span className={cn("squircle absolute inset-0 flex items-center justify-center", RESUME_ICON.accent)}>
              <span className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent" />
              <RESUME_ICON.icon className={cn("relative h-1/2 w-1/2 drop-shadow-sm", RESUME_ICON.iconClassName)} strokeWidth={2.25} />
            </span>
          </span>
        </DockIcon>
      </motion.div>
    </div>
  )
}
