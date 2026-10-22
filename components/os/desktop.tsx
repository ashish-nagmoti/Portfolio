"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/components/ui/use-mobile"
import { APPS, RESUME_ICON } from "./app-registry"
import { Window, type OriginRect } from "./window"
import { Dock } from "./dock"
import { DesktopWidgets, clearWidgetLayout } from "./widgets"
import { Tour, TOUR_DONE_KEY } from "./tour"
import { WALLPAPERS, WallpaperPicker } from "./wallpapers"
import { ControlCenter } from "./control-center"
import { MenuBar } from "./menubar"
import { HomeScreen } from "./ios/home-screen"
import { Spotlight } from "./spotlight"
import { OSContextMenu } from "./context-menu"
import { SquircleDefs } from "./squircle-defs"
import type { AppId, OpenWindow } from "./types"
import { cn } from "@/lib/utils"

interface DesktopProps {
  initialApp?: AppId
}

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

export function Desktop({ initialApp }: DesktopProps) {
  const isMobile = useIsMobile()
  const zRef = useRef(10)
  const desktopRef = useRef<HTMLDivElement>(null)
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
  const [tourOpen, setTourOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [wallpaperIdx, setWallpaperIdx] = useState(0)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [controlCenterOpen, setControlCenterOpen] = useState(false)
  // Control Center: Focus hides the widgets; Display dims the whole screen (30–100%)
  const [focusMode, setFocusMode] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [bounceId, setBounceId] = useState<AppId | null>(null)
  const [bounceToken, setBounceToken] = useState(0)
  const [pendingOrigin, setPendingOrigin] = useState<OriginRect | null>(null)

  // First visit: offer the guided tour once the desktop has settled in.
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!localStorage.getItem(TOUR_DONE_KEY)) {
      const t = setTimeout(() => setTourOpen(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("os-wallpaper") : null
    if (saved) setWallpaperIdx(Number(saved) % WALLPAPERS.length)
    setFocusMode(localStorage.getItem("os-focus") === "1")
    const b = Number(localStorage.getItem("os-brightness"))
    if (b >= 30 && b <= 100) setBrightness(b)
  }, [])

  const toggleFocus = () =>
    setFocusMode((on) => {
      localStorage.setItem("os-focus", on ? "0" : "1")
      return !on
    })
  const changeBrightness = (v: number) => {
    setBrightness(v)
    localStorage.setItem("os-brightness", String(v))
  }

  const endTour = () => {
    setTourOpen(false)
    localStorage.setItem(TOUR_DONE_KEY, "1")
  }

  const selectWallpaper = (i: number) => {
    setWallpaperIdx(i)
    localStorage.setItem("os-wallpaper", String(i))
  }

  const downloadResume = () => {
    const a = document.createElement("a")
    a.href = RESUME_ICON.href
    a.download = ""
    a.click()
  }

  // A real reboot: the boot screen is skipped once "os-booted" is set for the
  // session (see os-shell.tsx), so forget it before reloading. Widgets come
  // back in their default slots too, like a fresh desktop.
  const restart = () => {
    sessionStorage.removeItem("os-booted")
    clearWidgetLayout()
    window.location.reload()
  }

  // Remounting the widgets puts each back in its slot (and replays their
  // entrance), which reads as the reset it is.
  const [widgetLayoutKey, setWidgetLayoutKey] = useState(0)
  const resetWidgetLayout = () => {
    clearWidgetLayout()
    setWidgetLayoutKey((k) => k + 1)
  }

  const openApp = (id: AppId, rect?: DOMRect) => {
    setPendingOrigin(rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null)
    // Phone: an open app is a history entry, so the system back gesture or
    // button returns Home instead of leaving the site (see the popstate effect).
    if (isMobile) {
      const anyOpen = openWindows.some((w) => !w.minimized)
      if (anyOpen) window.history.replaceState({ osApp: id }, "")
      else window.history.pushState({ osApp: id }, "")
    }
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

  const focusedApp = useMemo(() => {
    const visible = openWindows.filter((w) => !w.minimized)
    if (visible.length === 0) return null
    return visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a)).id
  }, [openWindows])

  const closeApp = (id: AppId) => {
    // Phone: step back past the entry the app pushed; popstate then closes it
    if (isMobile && window.history.state?.osApp) {
      window.history.back()
      return
    }
    setOpenWindows((prev) => prev.filter((w) => w.id !== id))
  }

  useEffect(() => {
    if (!isMobile) return
    const onPop = () => setOpenWindows([])
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [isMobile])
  const minimizeApp = (id: AppId) => setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)))
  const toggleMaximize = (id: AppId) =>
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)))
  const focusApp = (id: AppId) => {
    zRef.current += 1
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: zRef.current } : w)))
  }
  const resizeApp = (id: AppId, size: { width: number; height: number }) =>
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)))
  const moveApp = (id: AppId, pos: { x: number; y: number }) =>
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, pos } : w)))

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
      ref={desktopRef}
      className="relative min-h-screen h-screen w-full overflow-hidden"
      onContextMenu={(e) => {
        if (isMobile) return
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
    >
      <SquircleDefs />
      {/* Wallpaper */}
      <div className={cn("pointer-events-none absolute inset-0 bg-cover bg-center", WALLPAPERS[wallpaperIdx].className)} />

      {!isMobile && (
        <MenuBar
          focusedApp={focusedApp}
          openWindows={openWindows}
          onOpenApp={openApp}
          onOpenSpotlight={() => setSpotlightOpen(true)}
          onRestart={restart}
          onResetWidgets={resetWidgetLayout}
          onStartTour={() => setTourOpen(true)}
          onChangeWallpaper={() => setPickerOpen(true)}
          onCloseFocused={closeFocused}
          onDownloadResume={downloadResume}
          onShowDesktop={showDesktop}
          controlCenterOpen={controlCenterOpen}
          onToggleControlCenter={() => setControlCenterOpen((v) => !v)}
        />
      )}

      {/* Phone: an iOS-style home screen. Desktop: widgets (apps launch from the Dock / Spotlight) */}
      {isMobile ? (
        <HomeScreen onOpenApp={openApp} onOpenControlCenter={() => setControlCenterOpen(true)} focus={focusMode} />
      ) : (
        !focusMode && <DesktopWidgets key={widgetLayoutKey} onOpenApp={openApp} dragBoundsRef={desktopRef} />
      )}

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
            onMove={(pos) => moveApp(w.id, pos)}
          />
        ))}
      </AnimatePresence>

      {/* Guided tour: first visit, and Help → Take the Tour */}
      <Tour open={tourOpen && !isMobile} onClose={endTour} onOpenApp={openApp} />

      <WallpaperPicker
        open={pickerOpen}
        current={wallpaperIdx}
        onSelect={selectWallpaper}
        onClose={() => setPickerOpen(false)}
      />

      <ControlCenter
        open={controlCenterOpen}
        onClose={() => setControlCenterOpen(false)}
        focus={focusMode}
        onToggleFocus={toggleFocus}
        brightness={brightness}
        onBrightness={changeBrightness}
        onChangeWallpaper={() => setPickerOpen(true)}
        onDownloadResume={downloadResume}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        onResetWidgets={resetWidgetLayout}
        isMobile={isMobile}
      />

      <AnimatePresence>
        {contextMenu && (
          <OSContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onOpenApp={openApp}
            onRefresh={() => setOpenWindows([])}
            onChangeWallpaper={() => setPickerOpen(true)}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>

      <Spotlight open={spotlightOpen} onClose={() => setSpotlightOpen(false)} onOpenApp={openApp} />

      {/* Display brightness: a dimming layer over everything, never catching clicks */}
      {brightness < 100 && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[99999] bg-black"
          style={{ opacity: ((100 - brightness) / 100) * 0.85 }}
        />
      )}

      {!isMobile && <Dock openWindows={openWindows} onOpen={openApp} bounceId={bounceId} bounceToken={bounceToken} />}
    </div>
  )
}
