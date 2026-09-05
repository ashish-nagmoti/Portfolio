"use client"

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { APPS, APP_ORDER } from "./app-registry"
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
            className="fixed inset-0 z-[9990] bg-black/20 backdrop-blur-sm"
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
              <div className="rounded-2xl bg-white/85 dark:bg-[#2a2a30]/95 backdrop-blur-2xl shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/5 dark:border-white/10">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Spotlight Search"
                    className="flex-1 bg-transparent outline-none text-lg"
                  />
                </div>
                {results.length > 0 && (
                  <div className="max-h-72 overflow-y-auto p-2">
                    {results.map((app, i) => (
                      <button
                        key={app.id}
                        onClick={() => openResult(app.id)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                          i === activeIndex ? "bg-primary text-primary-foreground" : "hover:bg-black/5 dark:hover:bg-white/10",
                        )}
                      >
                        <span className={cn("p-1.5 rounded-lg squircle", app.accent)}>
                          <app.icon className={cn("h-4 w-4", app.iconClassName ?? "text-white")} strokeWidth={2.25} />
                        </span>
                        <span className="text-sm font-medium">{app.title}</span>
                      </button>
                    ))}
                  </div>
                )}
                {results.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No results</div>}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
