"use client"

import { motion } from "framer-motion"

interface IntroOverlayProps {
  onEnter: () => void
}

export function IntroOverlay({ onEnter }: IntroOverlayProps) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black px-4 font-mono"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md text-[#3dff8f]"
      >
        <p className="text-sm mb-1 opacity-70">guest@ashish-nagmoti:~$</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">./enter_room.sh</h1>
        <p className="text-sm opacity-80 mb-8 leading-relaxed">
          A small room, rendered in wireframe. Drag to look around, click the glowing objects to explore, and try
          the window when you're in.
        </p>
        <button
          onClick={onEnter}
          className="border px-6 py-2.5 text-sm font-semibold tracking-wide hover:bg-[#3dff8f] hover:text-black transition-colors"
          style={{ borderColor: "#3dff8f" }}
        >
          [ ENTER ]
        </button>
        <div className="flex items-center justify-center gap-6 mt-8 text-xs opacity-50">
          <span>drag = look around</span>
          <span>click = interact</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
