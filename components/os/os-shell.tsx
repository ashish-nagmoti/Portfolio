"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, MotionConfig } from "framer-motion"
import { usePhoneOrientation } from "@/components/ui/use-mobile"
import { BootScreen } from "./boot-screen"
import { Desktop } from "./desktop"
import { RotatePrompt } from "./rotate-prompt"
import type { AppId } from "./types"

interface OSShellProps {
  initialApp?: AppId
}

export function OSShell({ initialApp }: OSShellProps) {
  const { isPhone, isPortrait } = usePhoneOrientation()
  const [booted, setBooted] = useState<boolean | null>(null)

  useEffect(() => {
    setBooted(typeof window !== "undefined" && sessionStorage.getItem("os-booted") === "1")
  }, [])

  const finishBoot = () => {
    sessionStorage.setItem("os-booted", "1")
    setBooted(true)
  }

  if (booted === null) return null

  if (isPhone && isPortrait) return <RotatePrompt />

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">{!booted && <BootScreen key="boot" onDone={finishBoot} />}</AnimatePresence>
      {booted && <Desktop initialApp={initialApp} />}
    </MotionConfig>
  )
}
