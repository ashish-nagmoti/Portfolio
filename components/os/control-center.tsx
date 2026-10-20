"use client"

import { useEffect, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import {
  GithubLogo,
  LinkedinLogo,
  EnvelopeSimple,
  Check,
  CircleHalf,
  Moon,
  Sun,
  Image as ImageIcon,
  FilePdf,
  MagnifyingGlass,
  SquaresFour,
  ArrowUpRight,
} from "@phosphor-icons/react"
import { useNowPlaying, AlbumArt, NowPlayingLabel } from "./now-playing"
import { cn } from "@/lib/utils"

const EMAIL = "ashishnagmoti2310@gmail.com"

/** The menu-bar glyph: two stacked toggle switches, as on macOS. */
export function ControlCenterGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <rect x="1" y="2" width="14" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12.5" cy="4.5" r="1.6" fill="currentColor" />
      <rect x="1" y="9" width="14" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="3.5" cy="11.5" r="1.6" fill="currentColor" />
    </svg>
  )
}

// A module: the rounded, lighter block every control sits in.
const MODULE =
  "rounded-[18px] bg-white/55 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.06)] dark:bg-white/[0.09] dark:shadow-[inset_0_0.5px_0_rgba(255,255,255,0.12)]"

/** A round toggle-style button with a label beside it (Wi-Fi, Bluetooth… here: ways to reach Ashish). */
function RowButton({
  icon,
  label,
  sub,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  sub: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="group flex w-full items-center gap-2.5 rounded-xl text-left">
      <span
        className={cn(
          "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-colors",
          active ? "bg-primary text-white" : "bg-black/[0.08] text-foreground group-hover:bg-black/[0.14] dark:bg-white/15 dark:group-hover:bg-white/25",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-semibold leading-tight">{label}</span>
        <span className="block truncate text-[11px] leading-tight text-muted-foreground">{sub}</span>
      </span>
    </button>
  )
}

/** A half-width module that's a single on/off toggle (Appearance, Focus). */
function ToggleModule({
  icon,
  label,
  sub,
  on,
  onClick,
}: {
  icon: ReactNode
  label: string
  sub: string
  on: boolean
  onClick: () => void
}) {
  return (
    <button onClick={onClick} aria-pressed={on} className={cn(MODULE, "flex items-center gap-2.5 px-3 text-left")}>
      <span
        className={cn(
          "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-colors",
          on ? "bg-primary text-white" : "bg-black/[0.08] dark:bg-white/15",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-semibold leading-tight">{label}</span>
        <span className="block text-[11px] leading-tight text-muted-foreground">{sub}</span>
      </span>
    </button>
  )
}

/** A small square shortcut in the bottom row. */
function Tile({ icon, label, title, onClick }: { icon: ReactNode; label: string; title?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={title ?? label}
      title={title ?? label}
      className={cn(MODULE, "group flex aspect-square flex-col items-center justify-center gap-1 transition-transform active:scale-95")}
    >
      <span className="text-foreground/80 group-hover:text-foreground">{icon}</span>
      <span className="text-[9.5px] font-medium leading-none text-muted-foreground">{label}</span>
    </button>
  )
}

/** The Display slider: a fat pill whose fill is the brightness, sun icon riding at the left. */
function BrightnessSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className={cn(MODULE, "px-3 pb-3 pt-2.5")}>
      <p className="mb-2 text-[12px] font-semibold">Display</p>
      <div className="relative h-[22px] overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
        <div className="absolute inset-y-0 left-0 rounded-full bg-white shadow-sm" style={{ width: `${Math.max(value, 14)}%` }} />
        <Sun weight="fill" className="pointer-events-none absolute left-[5px] top-1/2 h-3 w-3 -translate-y-1/2 text-black/45" />
        <input
          type="range"
          min={30}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Display brightness"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}

function NowPlayingModule() {
  const np = useNowPlaying()
  if (!np?.configured || !np.track) return null
  const { track, isPlaying } = np
  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(MODULE, "col-span-4 flex items-center gap-3 p-2.5 pr-3.5")}
    >
      <AlbumArt src={track.art} className="h-11 w-11 rounded-lg" />
      <span className="min-w-0 flex-1">
        <NowPlayingLabel playing={isPlaying} />
        <span className="mt-0.5 block truncate text-[12.5px] font-semibold leading-tight">{track.title}</span>
        <span className="block truncate text-[11px] leading-tight text-muted-foreground">{track.artist}</span>
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </a>
  )
}

interface ControlCenterProps {
  open: boolean
  onClose: () => void
  focus: boolean
  onToggleFocus: () => void
  brightness: number
  onBrightness: (v: number) => void
  onChangeWallpaper: () => void
  onDownloadResume: () => void
  onOpenSpotlight: () => void
  onResetWidgets: () => void
}

/** macOS Control Center, re-imagined for a portfolio: quick links, appearance, focus, display, music. */
export function ControlCenter({
  open,
  onClose,
  focus,
  onToggleFocus,
  brightness,
  onBrightness,
  onChangeWallpaper,
  onDownloadResume,
  onOpenSpotlight,
  onResetWidgets,
}: ControlCenterProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      // Close this panel only, not the focused window behind it
      e.stopImmediatePropagation()
      onClose()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [open, onClose])

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }
  const then = (fn: () => void) => () => {
    fn()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[9810]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            style={{ transformOrigin: "top right" }}
            role="dialog"
            aria-label="Control Center"
            className="fixed right-2 top-[38px] z-[9811] w-[320px] select-none rounded-[24px] border border-black/[0.08] bg-[#ececec]/75 p-2.5 text-foreground shadow-[0_18px_50px_-8px_rgba(0,0,0,0.35)] backdrop-blur-3xl backdrop-saturate-150 dark:border-white/[0.12] dark:bg-[#1e1e20]/75 dark:shadow-[0_20px_60px_-6px_rgba(0,0,0,0.7)]"
          >
            <div className="grid grid-cols-4 gap-2.5">
              {/* Reach Ashish: the Wi-Fi / Bluetooth / AirDrop block */}
              <div className={cn(MODULE, "col-span-2 row-span-2 flex flex-col justify-center gap-3 px-3 py-3")}>
                <RowButton
                  icon={<GithubLogo weight="fill" className="h-4 w-4" />}
                  label="GitHub"
                  sub="45+ repos"
                  onClick={then(() => window.open("https://github.com/ashish-nagmoti", "_blank", "noopener,noreferrer"))}
                />
                <RowButton
                  icon={<LinkedinLogo weight="fill" className="h-4 w-4" />}
                  label="LinkedIn"
                  sub="Connect"
                  onClick={then(() =>
                    window.open("https://www.linkedin.com/in/ashish-nagmoti-54269b249", "_blank", "noopener,noreferrer"),
                  )}
                />
                <RowButton
                  icon={copied ? <Check weight="bold" className="h-4 w-4" /> : <EnvelopeSimple weight="fill" className="h-4 w-4" />}
                  label="Email"
                  sub={copied ? "Copied to clipboard" : "Copy address"}
                  active={copied}
                  onClick={copyEmail}
                />
              </div>

              <div className="col-span-2 row-span-2 grid grid-rows-2 gap-2.5">
                <ToggleModule
                  icon={<CircleHalf weight="fill" className="h-4 w-4" />}
                  label="Dark Mode"
                  sub={dark ? "On" : "Off"}
                  on={dark}
                  onClick={() => setTheme(dark ? "light" : "dark")}
                />
                <ToggleModule
                  icon={<Moon weight="fill" className="h-4 w-4" />}
                  label="Focus"
                  sub={focus ? "On" : "Off"}
                  on={focus}
                  onClick={onToggleFocus}
                />
              </div>

              <div className="col-span-4">
                <BrightnessSlider value={brightness} onChange={onBrightness} />
              </div>

              <NowPlayingModule />

              <Tile icon={<ImageIcon weight="fill" className="h-5 w-5" />} label="Wallpaper" onClick={then(onChangeWallpaper)} />
              <Tile icon={<FilePdf weight="fill" className="h-5 w-5" />} label="Resume" onClick={then(onDownloadResume)} />
              <Tile icon={<MagnifyingGlass weight="bold" className="h-5 w-5" />} label="Search" onClick={then(onOpenSpotlight)} />
              <Tile icon={<SquaresFour weight="fill" className="h-5 w-5" />} label="Reset" title="Reset widget layout" onClick={then(onResetWidgets)} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
