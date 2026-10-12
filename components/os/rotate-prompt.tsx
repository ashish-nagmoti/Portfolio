"use client"

import { motion } from "framer-motion"
import { DeviceMobile as Smartphone } from "@phosphor-icons/react"
export function RotatePrompt() {
  return (
    <div className="fixed inset-0 z-[20000] flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#0a84ff]/20 via-background to-[#5ac8fa]/20 px-8 text-center">
      <motion.div
        animate={{ rotate: [0, 0, -90, -90, 0, 0] }}
        transition={{ duration: 2.6, times: [0, 0.15, 0.4, 0.75, 0.9, 1], repeat: Infinity, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-[28%] bg-primary/10 shadow-clay"
      >
        <Smartphone className="h-10 w-10 text-primary" />
      </motion.div>
      <div className="space-y-2">
        <p className="text-lg font-semibold">Rotate your device</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          This desktop experience is built for landscape. Turn your phone sideways to continue.
        </p>
      </div>
    </div>
  )
}
