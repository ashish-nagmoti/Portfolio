"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { PANELS } from "./panel-registry"
import type { PanelId } from "./types"
import { cn } from "@/lib/utils"

interface ContentPanelProps {
  panelId: PanelId | null
  onClose: () => void
}

export function ContentPanel({ panelId, onClose }: ContentPanelProps) {
  const panel = panelId ? PANELS[panelId] : null

  return (
    <AnimatePresence>
      {panel && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-black/20 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "fixed z-[9991] bg-card shadow-2xl flex flex-col",
              "inset-x-0 bottom-0 top-16 rounded-t-3xl",
              "sm:inset-y-6 sm:right-6 sm:left-auto sm:top-6 sm:bottom-6 sm:w-[min(90vw,640px)] sm:rounded-3xl",
            )}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <span className={cn("p-2 rounded-full shadow-clay-sm", panel.accent)}>
                  <panel.icon className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold">{panel.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <panel.Content />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
