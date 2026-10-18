"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { TerminalWindow as TerminalSquare, User, CircleHalf as SunMoon, ArrowCounterClockwise as RotateCcw, Image } from "@phosphor-icons/react"
import { MENU_PANEL, MENU_ROW } from "./menubar"
import type { AppId } from "./types"
import { cn } from "@/lib/utils"

interface OSContextMenuProps {
  x: number
  y: number
  onOpenApp: (id: AppId) => void
  onRefresh: () => void
  onChangeWallpaper: () => void
  onClose: () => void
}

export function OSContextMenu({ x, y, onOpenApp, onRefresh, onChangeWallpaper, onClose }: OSContextMenuProps) {
  const { theme, setTheme } = useTheme()

  const items = [
    { icon: TerminalSquare, label: "Open Terminal", action: () => onOpenApp("terminal") },
    { icon: User, label: "About This OS", action: () => onOpenApp("about") },
    "-",
    { icon: Image, label: "Change Wallpaper…", action: onChangeWallpaper },
    { icon: SunMoon, label: "Toggle Appearance", action: () => setTheme(theme === "light" ? "dark" : "light") },
    "-",
    { icon: RotateCcw, label: "Close All Windows", action: onRefresh },
  ] as const

  // Open toward the inside of the screen when clicked near an edge
  const W = 220
  const H = 190
  const left = typeof window !== "undefined" ? Math.min(x, window.innerWidth - W - 8) : x
  const top = typeof window !== "undefined" ? Math.min(y, window.innerHeight - H - 8) : y

  return (
    <>
      <div className="fixed inset-0 z-[9990]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose() }} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.08 } }}
        transition={{ duration: 0.1 }}
        style={{ top, left, width: W }}
        role="menu"
        className={cn("fixed z-[9991]", MENU_PANEL)}
      >
        {items.map((item, i) =>
          item === "-" ? (
            <div key={`sep-${i}`} className="mx-2.5 my-[5px] h-px bg-black/10 dark:bg-white/10" />
          ) : (
            <button
              key={item.label}
              role="menuitem"
              onClick={() => {
                item.action()
                onClose()
              }}
              className={MENU_ROW}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
              {item.label}
            </button>
          ),
        )}
      </motion.div>
    </>
  )
}
