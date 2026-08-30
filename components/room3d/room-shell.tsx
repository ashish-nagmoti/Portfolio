"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence } from "framer-motion"
import { IntroOverlay } from "./intro-overlay"
import { ContentPanel } from "./content-panel"
import type { PanelId } from "./types"

const RoomCanvas = dynamic(() => import("./room-canvas").then((m) => m.RoomCanvas), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <span className="font-mono text-sm text-[#3dff8f] animate-pulse">loading room.exe ...</span>
    </div>
  ),
})

interface RoomShellProps {
  initialPanel?: PanelId
}

export function RoomShell({ initialPanel }: RoomShellProps) {
  const [entered, setEntered] = useState(false)
  const [activePanel, setActivePanel] = useState<PanelId | null>(initialPanel ?? null)

  const downloadResume = () => {
    const a = document.createElement("a")
    a.href = "/clg_resume_v3.pdf"
    a.download = ""
    a.click()
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {entered && <RoomCanvas onSelect={setActivePanel} onDownloadResume={downloadResume} />}

      {/* CRT scanline + vignette overlay */}
      {entered && (
        <div
          className="pointer-events-none fixed inset-0 z-[9400]"
          style={{
            background:
              "repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.12) 3px), radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
            mixBlendMode: "multiply",
          }}
        />
      )}

      <AnimatePresence>{!entered && <IntroOverlay onEnter={() => setEntered(true)} />}</AnimatePresence>

      <ContentPanel panelId={activePanel} onClose={() => setActivePanel(null)} />
    </div>
  )
}
