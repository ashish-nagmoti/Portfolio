"use client"

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

/*
 * Dynamic Island-style confirmations ("Email copied", "Link copied"): a black
 * pill that grows out of the top centre of the screen and shrinks back. Any
 * component can call showToast(); <Island /> renders whichever is current.
 */
type Toast = { id: number; icon?: ReactNode; text: string }

let current: Toast | null = null
let nextId = 0
const listeners = new Set<() => void>()
let hideTimer: ReturnType<typeof setTimeout> | null = null

export function showToast(text: string, icon?: ReactNode) {
  current = { id: ++nextId, icon, text }
  listeners.forEach((l) => l())
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    current = null
    listeners.forEach((l) => l())
  }, 1900)
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function Island({ top = "calc(env(safe-area-inset-top) + 10px)" }: { top?: string }) {
  const toast = useSyncExternalStore(subscribe, () => current, () => null)
  // Content fades in only once the pill has widened, like the real island
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(false)
    if (!toast) return
    const t = setTimeout(() => setReady(true), 120)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className="pointer-events-none fixed inset-x-0 z-[99990] flex justify-center" style={{ top }} aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ width: 120, height: 34, opacity: 0, y: -6 }}
            animate={{ width: "auto", height: 40, opacity: 1, y: 0 }}
            exit={{ width: 120, height: 34, opacity: 0, y: -6, transition: { duration: 0.22 } }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="flex items-center justify-center overflow-hidden rounded-full bg-black px-4 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.9 }}
              className="flex items-center gap-2 whitespace-nowrap text-[14px] font-medium"
            >
              {toast.icon}
              {toast.text}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
