"use client"

import { useEffect, useState } from "react"

interface TypewriterProps {
  text: string
  speed?: number
  startDelay?: number
  className?: string
}

export function Typewriter({ text, speed = 40, startDelay = 0, className }: TypewriterProps) {
  const [shown, setShown] = useState("")

  useEffect(() => {
    let i = 0
    let interval: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setShown(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return (
    <span className={className}>
      {shown}
      <span className="terminal-cursor">▌</span>
    </span>
  )
}
