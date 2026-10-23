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
  /** Phone: iOS search, pinned to the top over a blurred home screen, with Cancel. */
  isMobile?: boolean
}

// What each app holds, so "kavach" finds Projects and "hire" finds Contact
const KEYWORDS: Record<AppId, string> = {
  about: "ashish profile experience skills awards education esds resume history leetcode",
  projects: "kavach sovereignrag rag system map storymail kalashala aceup work portfolio",
  terminal: "cli shell commands neofetch",
  contact: "email linkedin github hire reach message collaborate",
  blog: "medium posts writing articles aws arch linux cs50 hacktoberfest notes",
  interests: "videos articles reading watching saved",
}

export function Spotlight({ open, onClose, onOpenApp, isMobile }: SpotlightProps) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = APP_ORDER.map((id) => APPS[id])
    if (!q) return list
    return list.filter((a) => a.title.toLowerCase().includes(q) || KEYWORDS[a.id].includes(q))
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
            className={cn("fixed inset-0 z-[9990]", isMobile ? "bg-black/25 backdrop-blur-xl" : "bg-black/[0.04]")}
            onClick={onClose}
          />
          <div
            className={cn(
              "pointer-events-none fixed inset-0 z-[9991] flex justify-center",
              isMobile ? "px-3 pt-[calc(env(safe-area-inset-top)+10px)]" : "px-4 pt-[18%]",
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn("pointer-events-auto w-full max-w-lg", isMobile && "flex flex-col")}
              role="dialog"
              aria-modal="true"
              aria-label="Spotlight search"
            >
              {isMobile && (
                <div className="mb-3 flex items-center gap-2">
                  <label className="flex h-11 flex-1 items-center gap-2 rounded-[14px] bg-white/80 px-3 shadow-sm backdrop-blur-xl dark:bg-white/[0.14]">
                    <Search weight="bold" className="h-[18px] w-[18px] shrink-0 text-foreground/50" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search"
                      enterKeyHint="go"
                      className="min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-foreground/45"
                    />
                  </label>
                  <button onClick={onClose} className="px-1 text-[17px] text-primary active:opacity-50">
                    Cancel
                  </button>
                </div>
              )}
              <div className="overflow-hidden rounded-[26px] border border-black/[0.08] bg-[#f6f6f6]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_24px_60px_-12px_rgba(0,0,0,0.35)] backdrop-blur-3xl backdrop-saturate-150 dark:border-white/[0.12] dark:bg-[#262628]/80 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_70px_-10px_rgba(0,0,0,0.7)]">
                <div className={cn("flex items-center gap-3 px-5 py-3.5", isMobile && "hidden", (results.length > 0 || query) && "border-b border-black/[0.07] dark:border-white/[0.08]")}>
                  <Search weight="bold" className="h-5 w-5 shrink-0 text-foreground/45" />
                  <input
                    ref={isMobile ? undefined : inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Spotlight Search"
                    className="flex-1 bg-transparent text-[22px] font-light tracking-[-0.01em] outline-none placeholder:text-foreground/35 focus-visible:outline-none"
                  />
                </div>
                {results.length > 0 && (
                  <div className={cn("overflow-y-auto px-2 pb-2 pt-1.5", isMobile ? "max-h-[60dvh]" : "max-h-72")}>
                    <p className="px-3 pb-1 pt-1 text-[11px] font-semibold text-foreground/40">{query ? "Top Hits" : "Applications"}</p>
                    {results.map((app, i) => (
                      <button
                        key={app.id}
                        onClick={() => openResult(app.id)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-[10px] px-3 text-left",
                          isMobile ? "py-2.5 active:bg-black/5 dark:active:bg-white/10" : "py-1.5",
                          !isMobile && (i === activeIndex ? "bg-primary text-white" : "hover:bg-black/5 dark:hover:bg-white/10"),
                        )}
                      >
                        <AppIcon app={app.id} className={cn("shrink-0", isMobile ? "h-9 w-9" : "h-7 w-7")} />
                        <span className={cn("flex-1 font-medium", isMobile ? "text-[16px]" : "text-[14px]")}>
                          {isMobile ? app.title.replace(/\.(txt|app)$|\/$/, "") : app.title}
                        </span>
                        {i === activeIndex && !isMobile && <span className="text-[11px] text-white/75">Open ↩</span>}
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
