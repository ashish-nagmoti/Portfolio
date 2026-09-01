"use client"

import { useEffect, useState } from "react"
import { SignalHigh, Wifi, BatteryFull } from "lucide-react"

export const STATUS_BAR_HEIGHT = 44

export function StatusBar() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }))
    update()
    const interval = setInterval(update, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed top-0 inset-x-0 z-[9700] flex items-center justify-between px-6 text-foreground select-none pointer-events-none"
      style={{ height: STATUS_BAR_HEIGHT }}
    >
      <span className="text-[15px] font-semibold tabular-nums">{time}</span>
      <div className="flex items-center gap-1.5">
        <SignalHigh className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
      </div>
    </div>
  )
}
