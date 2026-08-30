"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const STATUS_MESSAGES = [
  "Starting ashish-os...",
  "Mounting /home/ashish...",
  "Loading backend services...",
  "Connecting to cloud...",
  "Initializing AI modules...",
  "Almost there...",
]

interface BootScreenProps {
  onDone: () => void
}

export function BootScreen({ onDone }: BootScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 2200
    const stepMs = 40
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / duration) * 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(interval)
        setTimeout(onDone, 400)
      }
    }, stepMs)
    return () => clearInterval(interval)
  }, [onDone])

  const messageIndex = Math.min(STATUS_MESSAGES.length - 1, Math.floor((progress / 100) * STATUS_MESSAGES.length))

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onDone}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-clay-indigo to-clay-sky flex items-center justify-center mb-10 shadow-2xl"
      >
        <span className="text-white text-3xl font-bold">A</span>
      </motion.div>
      <div className="w-56 h-1 rounded-full bg-white/15 overflow-hidden">
        <div className="h-full bg-white rounded-full transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-4 text-white/40 text-xs tracking-wide">{STATUS_MESSAGES[messageIndex]}</p>
      <span className="fixed bottom-6 inset-x-0 text-center text-xs text-white/25">click anywhere to skip</span>
    </motion.div>
  )
}
