"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { IntroOverlay } from "./intro-overlay"
import { ContentPanel } from "./content-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import type { PanelId } from "./types"

const RoomCanvas = dynamic(() => import("./room-canvas").then((m) => m.RoomCanvas), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <div className="fixed inset-0 overflow-hidden">
      {entered && <RoomCanvas onSelect={setActivePanel} onDownloadResume={downloadResume} />}

      <AnimatePresence>{!entered && <IntroOverlay onEnter={() => setEntered(true)} />}</AnimatePresence>

      {entered && (
        <div className="fixed top-4 right-4 z-[9500]">
          <ThemeToggle />
        </div>
      )}

      <ContentPanel panelId={activePanel} onClose={() => setActivePanel(null)} />
    </div>
  )
}
