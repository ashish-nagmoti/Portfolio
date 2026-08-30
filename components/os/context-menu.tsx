"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { TerminalSquare, User, SunMoon, RotateCcw } from "lucide-react"
import type { AppId } from "./types"

interface OSContextMenuProps {
  x: number
  y: number
  onOpenApp: (id: AppId) => void
  onRefresh: () => void
  onClose: () => void
}

export function OSContextMenu({ x, y, onOpenApp, onRefresh, onClose }: OSContextMenuProps) {
  const { theme, setTheme } = useTheme()

  const items = [
    { icon: TerminalSquare, label: "Open Terminal", action: () => onOpenApp("terminal") },
    { icon: User, label: "About this OS", action: () => onOpenApp("about") },
    { icon: SunMoon, label: "Toggle Theme", action: () => setTheme(theme === "light" ? "dark" : "light") },
    { icon: RotateCcw, label: "Refresh Desktop", action: onRefresh },
  ]

  return (
    <>
      <div className="fixed inset-0 z-[9990]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose() }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.12 }}
        style={{ top: y, left: x }}
        className="fixed z-[9991] w-52 rounded-xl bg-white/90 dark:bg-[#2a2a30]/95 backdrop-blur-2xl shadow-2xl border border-black/5 dark:border-white/10 p-1.5"
      >
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              item.action()
              onClose()
            }}
            className="group flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-left text-sm"
          >
            <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground" />
            {item.label}
          </button>
        ))}
      </motion.div>
    </>
  )
}
