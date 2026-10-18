"use client"

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MagnifyingGlass as Search } from "@phosphor-icons/react"
import { APPS, APP_ORDER } from "./app-registry"
import { AppIcon } from "./app-icon"
import type { AppId } from "./types"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  open: boolean
  onClose: () => void
  onOpenApp: (id: AppId) => void
}

export function Spotlight({ open, onClose, onOpenApp }: SpotlightProps) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = APP_ORDER.map((id) => APPS[id])
    if (!q) return list
    return list.filter((a) => a.title.toLowerCase().includes(q))
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery("")
      setActiveIndex(0)
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const openResult = (id: AppId) => {
    onOpenApp(id)
    onClose()
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      const target = results[activeIndex]
      if (target) openResult(target.id)
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-black/[0.04]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[9991] flex justify-center pt-[18%] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-lg pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Spotlight search"
            >
              <div className="overflow-hidden rounded-[26px] border border-black/[0.08] bg-[#f6f6f6]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_24px_60px_-12px_rgba(0,0,0,0.35)] backdrop-blur-3xl backdrop-saturate-150 dark:border-white/[0.12] dark:bg-[#262628]/80 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_-10px_rgba(0,0,0,0.7)]">
                <div className={cn("flex items-center gap-3 px-5 py-3.5", (results.length > 0 || query) && "border-b border-black/[0.07] dark:border-white/[0.08]")}>
                  <Search weight="bold" className="h-5 w-5 shrink-0 text-foreground/45" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Spotlight Search"
                    className="flex-1 bg-transparent text-[22px] font-light tracking-[-0.01em] outline-none placeholder:text-foreground/35 focus-visible:outline-none"
                  />
                </div>
                {results.length > 0 && (
                  <div className="max-h-72 overflow-y-auto px-2 pb-2 pt-1.5">
                    <p className="px-3 pb-1 pt-1 text-[11px] font-semibold text-foreground/40">Applications</p>
                    {results.map((app, i) => (
                      <button
                        key={app.id}
                        onClick={() => openResult(app.id)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-[10px] px-3 py-1.5 text-left",
                          i === activeIndex ? "bg-primary text-white" : "hover:bg-black/5 dark:hover:bg-white/10",
                        )}
                      >
                        <AppIcon app={app.id} className="h-7 w-7 shrink-0" />
                        <span className="flex-1 text-[14px] font-medium">{app.title}</span>
                        {i === activeIndex && <span className="text-[11px] text-white/75">Open ↩</span>}
                      </button>
                    ))}
                  </div>
                )}
                {results.length === 0 && query && (
                  <div className="p-6 text-center text-sm text-muted-foreground">No results for “{query}”</div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
