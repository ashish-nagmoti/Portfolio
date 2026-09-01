"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronUp } from "lucide-react"

interface LockScreenProps {
  onUnlock: () => void
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }))
      setDate(now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }))
    }
    update()
    const interval = setInterval(update, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDragEnd={(_, info) => {
        if (info.offset.y < -60 || info.velocity.y < -400) onUnlock()
      }}
      onClick={onUnlock}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-between py-16 bg-gradient-to-br from-clay-indigo/40 via-background to-clay-sky/40 cursor-pointer touch-none"
    >
      <div className="flex-1" />
      <div className="text-center">
        <p className="text-7xl font-semibold tracking-tight">{time}</p>
        <p className="text-lg text-foreground/70 mt-2">{date}</p>
      </div>
      <div className="flex-1 flex items-end">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-foreground/60"
        >
          <ChevronUp className="h-5 w-5" />
          <span className="text-xs font-medium tracking-wide">swipe up to unlock</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
