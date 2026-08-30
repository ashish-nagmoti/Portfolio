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
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "fixed z-[9991] bg-black border shadow-2xl flex flex-col",
              "inset-x-0 bottom-0 top-16",
              "sm:inset-y-6 sm:right-6 sm:left-auto sm:top-6 sm:bottom-6 sm:w-[min(90vw,640px)]",
            )}
            style={{ borderColor: "#3dff8f" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: "#3dff8f44" }}>
              <div className="flex items-center gap-3 font-mono">
                <panel.icon className="h-5 w-5" style={{ color: "#3dff8f" }} />
                <h2 className="text-base font-bold tracking-wide" style={{ color: "#3dff8f" }}>
                  ./{panel.title.toLowerCase().replace(/\s+/g, "_")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 transition-colors font-mono"
                style={{ color: "#3dff8f" }}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain bg-background">
              <panel.Content />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
