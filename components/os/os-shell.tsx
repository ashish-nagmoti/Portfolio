"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { BootScreen } from "./boot-screen"
import { Desktop } from "./desktop"
import type { AppId } from "./types"

interface OSShellProps {
  initialApp?: AppId
}

export function OSShell({ initialApp }: OSShellProps) {
  const [booted, setBooted] = useState<boolean | null>(null)

  useEffect(() => {
    setBooted(typeof window !== "undefined" && sessionStorage.getItem("os-booted") === "1")
  }, [])

  const finishBoot = () => {
    sessionStorage.setItem("os-booted", "1")
    setBooted(true)
  }

  if (booted === null) return null

  return (
    <>
      <AnimatePresence mode="wait">{!booted && <BootScreen key="boot" onDone={finishBoot} />}</AnimatePresence>
      {booted && <Desktop initialApp={initialApp} />}
    </>
  )
}
