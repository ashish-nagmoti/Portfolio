"use client"

import { motion } from "framer-motion"
import { MousePointer2, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IntroOverlayProps {
  onEnter: () => void
}

export function IntroOverlay({ onEnter }: IntroOverlayProps) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-clay-indigo/20 via-background to-clay-sky/20 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Ashish Nagmoti</h1>
        <p className="text-muted-foreground mb-8">
          Step into my little room. Look around and click on things — the desk, the bookshelf, the plant — to see
          what's inside.
        </p>
        <Button size="lg" onClick={onEnter} className="group">
          Enter the Room
        </Button>
        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <RotateCw className="h-3.5 w-3.5" /> Drag to look around
          </span>
          <span className="flex items-center gap-1.5">
            <MousePointer2 className="h-3.5 w-3.5" /> Click objects to explore
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
