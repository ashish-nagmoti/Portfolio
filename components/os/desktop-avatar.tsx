"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { AppId } from "./types"

// Rotating lines for the speech bubble.
const LINES = [
  "Hi, I'm Ashish 👋",
  "I build AI infrastructure.",
  "LLM inference, RAG and sovereign AI.",
  "Click me to learn more.",
  "Life works in mysterious ways.",
]

/**
 * A Bitmoji-style avatar in the middle of the desktop. It floats gently, talks
 * through a rotating speech bubble, and on click winks and opens About.
 *
 * The art is public/avatar.svg (and avatar-wink.svg), generated with DiceBear's
 * "Avataaars" style (free for personal and commercial use). To use a real
 * Bitmoji instead, replace those two files.
 */
export function DesktopAvatar({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  const [line, setLine] = useState(0)
  const [winking, setWinking] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setLine((i) => (i + 1) % LINES.length), 4200)
    return () => clearInterval(t)
  }, [])

  const hello = () => {
    setWinking(true)
    setTimeout(() => {
      setWinking(false)
      onOpenApp("about")
    }, 650)
  }

  return (
    // Positioning lives on a plain wrapper: Framer Motion writes `transform`
    // inline for the entrance below, which would override a translate here.
    // Hidden where there's no room: narrow screens, and short ones such as a landscape phone.
    <div className="pointer-events-none absolute left-1/2 top-[46%] z-0 -translate-x-1/2 -translate-y-1/2 max-md:hidden [@media(max-height:620px)]:hidden">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 22 }}
      className="relative"
    >
      {/* Speech bubble */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={line}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative whitespace-nowrap rounded-2xl border border-black/5 bg-white/90 px-3.5 py-2 text-[13px] font-medium text-foreground shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#2c2c2e]/90"
          >
            {LINES[line]}
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-black/5 bg-white/90 dark:border-white/10 dark:bg-[#2c2c2e]/90" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Avatar: a gentle float, a lift on hover, a wink on click */}
      <motion.button
        onClick={hello}
        aria-label="Say hi to Ashish (opens About)"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, rotate: -4 }}
        // Fade the bottom of the bust so the crop reads as intentional, not cut off.
        className="pointer-events-auto relative block h-[200px] w-[200px] cursor-pointer [mask-image:linear-gradient(to_bottom,black_78%,transparent)]"
      >
        {/* Both expressions stay mounted, so the wink never flashes while loading. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.svg"
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)] transition-opacity duration-150"
          style={{ opacity: winking ? 0 : 1 }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar-wink.svg"
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)] transition-opacity duration-150"
          style={{ opacity: winking ? 1 : 0 }}
        />
      </motion.button>

    </motion.div>
    </div>
  )
}
