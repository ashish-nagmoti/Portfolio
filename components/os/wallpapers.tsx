"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

/**
 * Desktop wallpapers: original art in the style of recent macOS, rendered to
 * JPEGs in public/wallpapers (a light and a dark version of each, plus small
 * thumbnails for the picker). Only the image for the active theme loads.
 *
 * Class strings are spelled out in full so Tailwind can see them.
 */
export const WALLPAPERS = [
  {
    id: "sequoia",
    name: "Sequoia",
    className: "bg-[url('/wallpapers/sequoia-light.jpg')] dark:bg-[url('/wallpapers/sequoia-dark.jpg')]",
  },
  {
    id: "ventura",
    name: "Ventura",
    className: "bg-[url('/wallpapers/ventura-light.jpg')] dark:bg-[url('/wallpapers/ventura-dark.jpg')]",
  },
  {
    id: "sonoma",
    name: "Sonoma",
    className: "bg-[url('/wallpapers/sonoma-light.jpg')] dark:bg-[url('/wallpapers/sonoma-dark.jpg')]",
  },
  {
    id: "glass",
    name: "Liquid Glass",
    isNew: true,
    className: "bg-[url('/wallpapers/glass-light.jpg')] dark:bg-[url('/wallpapers/glass-dark.jpg')]",
  },
] as const

/** A small floating panel for choosing the wallpaper, like System Settings › Wallpaper. */
export function WallpaperPicker({
  open,
  current,
  onSelect,
  onClose,
}: {
  open: boolean
  current: number
  onSelect: (index: number) => void
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9850] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            role="dialog"
            aria-label="Wallpaper"
            className="relative w-full max-w-[560px] rounded-2xl border border-black/5 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#2a2a2c]/90"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold">Wallpaper</p>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {WALLPAPERS.map((w, i) => {
                const active = i === current
                return (
                  <button key={w.id} onClick={() => onSelect(i)} className="group text-left" aria-pressed={active}>
                    <span
                      className={cn(
                        "relative block aspect-[16/10] overflow-hidden rounded-xl ring-offset-2 ring-offset-white transition dark:ring-offset-[#2a2a2c]",
                        active ? "ring-[3px] ring-primary" : "ring-1 ring-black/10 group-hover:ring-black/25 dark:ring-white/10 dark:group-hover:ring-white/30",
                      )}
                    >
                      {/* Thumbnail for the theme in use */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/wallpapers/${w.id}-light-thumb.jpg`} alt="" className="h-full w-full object-cover dark:hidden" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/wallpapers/${w.id}-dark-thumb.jpg`} alt="" className="hidden h-full w-full object-cover dark:block" />
                      {active && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow">
                          <Check weight="bold" className="h-3 w-3" />
                        </span>
                      )}
                    </span>
                    <span className="mt-2 flex items-center gap-1.5 text-[13px] font-medium">
                      {w.name}
                      {"isNew" in w && w.isNew && (
                        <span className="rounded bg-primary/15 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-primary">
                          New
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">Each wallpaper has a light and dark version that follows your theme.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
