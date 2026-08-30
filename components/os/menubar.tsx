"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Wifi, BatteryFull, Search, Sun, Moon, Command } from "lucide-react"
import { APPS } from "./app-registry"
import type { AppId, OpenWindow } from "./types"
import { cn } from "@/lib/utils"

interface MenuBarProps {
  focusedApp: AppId | null
  openWindows: OpenWindow[]
  onOpenApp: (id: AppId) => void
  onOpenSpotlight: () => void
  onRefresh: () => void
}

export function MenuBar({ focusedApp, openWindows, onOpenApp, onOpenSpotlight, onRefresh }: MenuBarProps) {
  const { theme, setTheme } = useTheme()
  const [time, setTime] = useState<string | null>(null)
  const [appleMenuOpen, setAppleMenuOpen] = useState(false)
  const [windowMenuOpen, setWindowMenuOpen] = useState(false)

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
    update()
    const interval = setInterval(update, 15000)
    return () => clearInterval(interval)
  }, [])

  const appTitle = focusedApp ? APPS[focusedApp].title : "Finder"

  const closeMenus = () => {
    setAppleMenuOpen(false)
    setWindowMenuOpen(false)
  }

  return (
    <div className="fixed top-0 inset-x-0 z-[9800] h-8 flex items-center justify-between px-3 bg-white/70 dark:bg-black/40 backdrop-blur-xl border-b border-black/5 dark:border-white/10 text-[13px] font-medium select-none">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => {
              setWindowMenuOpen(false)
              setAppleMenuOpen((v) => !v)
            }}
            className={cn("flex items-center px-2 h-6 rounded", appleMenuOpen ? "bg-primary/20" : "hover:bg-black/5 dark:hover:bg-white/10")}
          >
            <Command className="h-3.5 w-3.5" />
          </button>
          <AnimatePresence>
            {appleMenuOpen && (
              <>
                <div className="fixed inset-0 z-0" onClick={closeMenus} />
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-0 mt-1.5 w-56 rounded-xl bg-white/90 dark:bg-[#2a2a30]/95 backdrop-blur-xl shadow-2xl border border-black/5 dark:border-white/10 py-1.5 z-10"
                >
                  <button
                    onClick={() => {
                      onOpenApp("about")
                      closeMenus()
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors text-left"
                  >
                    About This OS
                  </button>
                  <div className="my-1 h-px bg-black/10 dark:bg-white/10" />
                  <button
                    onClick={() => {
                      setTheme(theme === "light" ? "dark" : "light")
                      closeMenus()
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors text-left"
                  >
                    System Settings…
                  </button>
                  <div className="my-1 h-px bg-black/10 dark:bg-white/10" />
                  <button
                    onClick={() => {
                      onRefresh()
                      closeMenus()
                    }}
                    className="flex w-full items-center px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors text-left"
                  >
                    Restart Desktop
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <span className="font-bold">{appTitle}</span>

        <div className="hidden sm:flex items-center gap-4 text-foreground/70">
          <span className="hover:text-foreground transition-colors cursor-default">File</span>
          <span className="hover:text-foreground transition-colors cursor-default">Edit</span>
          <span className="hover:text-foreground transition-colors cursor-default">View</span>
          <div className="relative">
            <button
              onClick={() => {
                setAppleMenuOpen(false)
                setWindowMenuOpen((v) => !v)
              }}
              className={cn("hover:text-foreground transition-colors", windowMenuOpen && "text-foreground")}
            >
              Window
            </button>
            <AnimatePresence>
              {windowMenuOpen && (
                <>
                  <div className="fixed inset-0 z-0" onClick={closeMenus} />
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 mt-1.5 w-52 rounded-xl bg-white/90 dark:bg-[#2a2a30]/95 backdrop-blur-xl shadow-2xl border border-black/5 dark:border-white/10 py-1.5 z-10"
                  >
                    {openWindows.length === 0 && (
                      <span className="block px-3 py-1.5 text-foreground/40">No open windows</span>
                    )}
                    {openWindows.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          onOpenApp(w.id)
                          closeMenus()
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors text-left"
                      >
                        {APPS[w.id].title}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <span className="hover:text-foreground transition-colors cursor-default">Help</span>
        </div>
      </div>

      <div className="flex items-center gap-3.5 text-foreground/80">
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
        <button onClick={onOpenSpotlight} aria-label="Search" className="hover:text-foreground transition-colors">
          <Search className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
          className="hover:text-foreground transition-colors"
        >
          {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </button>
        {time && <span className="tabular-nums">{time}</span>}
      </div>
    </div>
  )
}
