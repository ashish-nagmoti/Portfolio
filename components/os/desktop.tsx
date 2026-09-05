"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"
import { APPS, APP_ORDER, RESUME_ICON } from "./app-registry"
import { Window, type OriginRect } from "./window"
import { Dock } from "./dock"
import { MenuBar } from "./menubar"
import { StatusBar } from "./ios/status-bar"
import { Spotlight } from "./spotlight"
import { OSContextMenu } from "./context-menu"
import { SquircleDefs } from "./squircle-defs"
import type { AppId, OpenWindow } from "./types"
import { cn } from "@/lib/utils"

interface DesktopProps {
  initialApp?: AppId
}

const WALLPAPERS = [
  "from-clay-indigo/25 via-background to-clay-sky/25",
  "from-clay-mint/25 via-background to-clay-peach/25",
  "from-clay-pink/25 via-background to-clay-indigo/25",
  "from-clay-sky/25 via-background to-clay-pink/25",
]

// Default window sizes are calibrated for a real laptop screen. A landscape
// phone (~375-430px tall) is far shorter, so clamp to what's actually
// available — otherwise windows render taller than the viewport itself.
function openSize(id: AppId) {
  const app = APPS[id]
  if (typeof window === "undefined") return { ...app.defaultSize }
  const maxW = window.innerWidth - 40
  const maxH = window.innerHeight - 120
  return {
    width: Math.min(app.defaultSize.width, Math.max(280, maxW)),
    height: Math.min(app.defaultSize.height, Math.max(220, maxH)),
  }
}

function spawnRect(id: AppId, openCount: number, size: { width: number; height: number }) {
  const app = APPS[id]
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280
  const vh = typeof window !== "undefined" ? window.innerHeight : 800
  const jitterX = Math.round(Math.random() * 70) - 35
  const jitterY = Math.round(Math.random() * 50) - 25
  const cascade = (openCount % 5) * 26
  const maxX = Math.max(20, vw - size.width - 20)
  const maxY = Math.max(40, vh - size.height - 110)
  const x = Math.min(Math.max(20, app.defaultPos.x + jitterX + cascade), maxX)
  const y = Math.min(Math.max(40, app.defaultPos.y + jitterY + cascade), maxY)
  return { x, y }
}

const iconContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
}

const iconItemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export function Desktop({ initialApp }: DesktopProps) {
  const isMobile = useIsMobile()
  const zRef = useRef(10)
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>(() =>
    initialApp
      ? [
          {
            id: initialApp,
            zIndex: zRef.current,
            minimized: false,
            maximized: false,
            pos: APPS[initialApp].defaultPos,
            size: openSize(initialApp),
          },
        ]
      : [],
  )
  const [showHint, setShowHint] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [wallpaperIdx, setWallpaperIdx] = useState(0)
  const [bounceId, setBounceId] = useState<AppId | null>(null)
  const [bounceToken, setBounceToken] = useState(0)
  const [pendingOrigin, setPendingOrigin] = useState<OriginRect | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!localStorage.getItem("os-welcome-seen")) {
      const t = setTimeout(() => setShowHint(true), 1000)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("os-wallpaper") : null
    if (saved) setWallpaperIdx(Number(saved) % WALLPAPERS.length)
  }, [])

  const dismissHint = () => {
    setShowHint(false)
    localStorage.setItem("os-welcome-seen", "1")
  }

  const cycleWallpaper = () => {
    setWallpaperIdx((i) => {
      const next = (i + 1) % WALLPAPERS.length
      localStorage.setItem("os-wallpaper", String(next))
      return next
    })
  }

  const downloadResume = () => {
    const a = document.createElement("a")
    a.href = RESUME_ICON.href
    a.download = ""
    a.click()
  }

  const openApp = (id: AppId, rect?: DOMRect) => {
    setPendingOrigin(rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null)
    const existing = openWindows.find((w) => w.id === id)
    zRef.current += 1
    const z = zRef.current
    if (existing) {
      setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: z, minimized: false } : w)))
      return
    }
    setBounceId(id)
    setBounceToken((t) => t + 1)
    const size = openSize(id)
    setOpenWindows((prev) => [
      ...prev,
      { id, zIndex: z, minimized: false, maximized: false, pos: spawnRect(id, prev.length, size), size },
    ])
  }

  const mobileAppOpen = isMobile && openWindows.some((w) => !w.minimized)
  const focusedApp = useMemo(() => {
    const visible = openWindows.filter((w) => !w.minimized)
    if (visible.length === 0) return null
    return visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a)).id
  }, [openWindows])

  const closeApp = (id: AppId) => setOpenWindows((prev) => prev.filter((w) => w.id !== id))
  const minimizeApp = (id: AppId) => setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)))
  const toggleMaximize = (id: AppId) =>
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)))
  const focusApp = (id: AppId) => {
    zRef.current += 1
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: zRef.current } : w)))
  }
  const resizeApp = (id: AppId, size: { width: number; height: number }) =>
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)))

  const closeFocused = () => {
    setOpenWindows((prev) => {
      const visible = prev.filter((w) => !w.minimized)
      if (visible.length === 0) return prev
      const top = visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a))
      return prev.filter((w) => w.id !== top.id)
    })
  }

  const showDesktop = () => setOpenWindows((prev) => prev.map((w) => ({ ...w, minimized: true })))

  const cycleFocus = () => {
    setOpenWindows((prev) => {
      const visible = prev.filter((w) => !w.minimized)
      if (visible.length < 2) return prev
      const current = visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a))
      const idx = visible.findIndex((w) => w.id === current.id)
      const next = visible[(idx + 1) % visible.length]
      zRef.current += 1
      const z = zRef.current
      return prev.map((w) => (w.id === next.id ? { ...w, zIndex: z } : w))
    })
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSpotlightOpen((v) => !v)
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Tab") {
        e.preventDefault()
        cycleFocus()
        return
      }
      if (e.key !== "Escape") return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return
      closeFocused()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div
      className="relative min-h-screen h-screen w-full overflow-hidden"
      onContextMenu={(e) => {
        if (isMobile) return
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
    >
      <SquircleDefs />
      {/* Wallpaper */}
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br", WALLPAPERS[wallpaperIdx])}>
        <div className="clay-blob absolute -top-32 -left-20 h-[32rem] w-[32rem] rounded-full bg-clay-indigo/30 blur-[100px]" />
        <div
          className="clay-blob absolute top-1/4 -right-24 h-[28rem] w-[28rem] rounded-full bg-clay-sky/30 blur-[100px]"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="clay-blob absolute bottom-[-6rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-clay-pink/20 blur-[100px]"
          style={{ animationDelay: "6s" }}
        />
      </div>

      {!isMobile && (
        <MenuBar
          focusedApp={focusedApp}
          openWindows={openWindows}
          onOpenApp={openApp}
          onOpenSpotlight={() => setSpotlightOpen(true)}
          onRefresh={() => setOpenWindows([])}
          onCloseFocused={closeFocused}
          onDownloadResume={downloadResume}
          onShowDesktop={showDesktop}
        />
      )}

      {isMobile && <StatusBar />}

      {/* Desktop icons */}
      <motion.div
        variants={iconContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-0 grid grid-cols-4 gap-x-3 gap-y-6 p-5 pt-16 justify-items-center sm:absolute sm:top-11 sm:bottom-24 sm:right-4 sm:grid-cols-1 sm:justify-items-end sm:gap-5 sm:overflow-y-auto sm:p-0 sm:pr-1 w-full sm:w-auto"
      >
        {isMobile && (
          <button
            onClick={() => setSpotlightOpen(true)}
            className="col-span-4 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/60 dark:bg-black/30 backdrop-blur-xl text-muted-foreground text-sm"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        )}
        {APP_ORDER.map((id) => {
          const app = APPS[id]
          return (
            <motion.button
              key={id}
              variants={iconItemVariants}
              onClick={(e) => openApp(id, e.currentTarget.getBoundingClientRect())}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex flex-col items-center gap-1.5 w-16 sm:w-20 text-center"
            >
              <span className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[22%] shadow-lg">
                <span className={cn("squircle absolute inset-0 flex items-center justify-center", app.accent)}>
                  <span className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent" />
                  <app.icon
                    className={cn("relative h-7 w-7 sm:h-8 sm:w-8 drop-shadow-sm", app.iconClassName ?? "text-white")}
                    strokeWidth={2.25}
                  />
                </span>
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-foreground/90 leading-tight drop-shadow-sm">
                {app.title}
              </span>
            </motion.button>
          )
        })}
        <motion.a
          variants={iconItemVariants}
          href={RESUME_ICON.href}
          download
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex flex-col items-center gap-1.5 w-16 sm:w-20 text-center"
        >
          <span className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[22%] shadow-lg">
            <span className={cn("squircle absolute inset-0 flex items-center justify-center", RESUME_ICON.accent)}>
              <span className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent" />
              <RESUME_ICON.icon
                className={cn("relative h-7 w-7 sm:h-8 sm:w-8 drop-shadow-sm", RESUME_ICON.iconClassName)}
                strokeWidth={2.25}
              />
            </span>
          </span>
          <span className="text-[11px] sm:text-xs font-medium text-foreground/90 leading-tight drop-shadow-sm">
            {RESUME_ICON.title}
          </span>
        </motion.a>
      </motion.div>

      {/* Windows */}
      <AnimatePresence>
        {openWindows.map((w) => (
          <Window
            key={w.id}
            appId={w.id}
            zIndex={w.zIndex}
            minimized={w.minimized}
            maximized={w.maximized}
            isMobile={isMobile}
            isFocused={focusedApp === w.id}
            pos={w.pos}
            size={w.size}
            originRect={pendingOrigin}
            onClose={() => closeApp(w.id)}
            onMinimize={() => minimizeApp(w.id)}
            onToggleMaximize={() => toggleMaximize(w.id)}
            onFocus={() => focusApp(w.id)}
            onResize={(size) => resizeApp(w.id, size)}
          />
        ))}
      </AnimatePresence>

      {/* First-visit hint */}
      <AnimatePresence>
        {showHint && !mobileAppOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-4 z-[9500] max-w-xs rounded-2xl bg-white/85 dark:bg-[#2a2a30]/95 backdrop-blur-2xl shadow-2xl border border-black/5 dark:border-white/10 p-5"
          >
            <button
              onClick={dismissHint}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="text-sm font-semibold mb-1">Welcome to ashish-os 🖥️</p>
            <p className="text-sm text-muted-foreground">
              {isMobile
                ? "Tap an icon to open it. Swipe up on the handle at the bottom of an app to close it."
                : "Click a dock icon or desktop item to open it. Drag windows by the title bar, resize from the corner, press ⌘K to search, ⌘Tab to switch windows, or right-click the desktop."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextMenu && (
          <OSContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onOpenApp={openApp}
            onRefresh={() => setOpenWindows([])}
            onChangeWallpaper={cycleWallpaper}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>

      <Spotlight open={spotlightOpen} onClose={() => setSpotlightOpen(false)} onOpenApp={openApp} />

      {!isMobile && !mobileAppOpen && <Dock openWindows={openWindows} onOpen={openApp} bounceId={bounceId} bounceToken={bounceToken} />}
    </div>
  )
}
