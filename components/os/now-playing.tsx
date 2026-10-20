"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { MusicNotesSimple, ArrowUpRight } from "@phosphor-icons/react"
import type { NowPlaying } from "@/lib/now-playing"
import { cn } from "@/lib/utils"

/*
 * One poller shared by everything that shows the current track (the desktop
 * widget and Control Center), so they agree and the API is hit once per
 * interval however many are mounted. Polling pauses while the tab is hidden.
 */
const POLL_MS = 30_000
let state: NowPlaying | null = null
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setTimeout> | null = null

async function poll() {
  if (timer) clearTimeout(timer)
  if (document.visibilityState === "visible") {
    try {
      const res = await fetch("/api/now-playing")
      if (res.ok) {
        state = (await res.json()) as NowPlaying
        // Stamp with the browser's clock: progress is advanced from here
        if (state.configured) state = { ...state, fetchedAt: Date.now() }
        listeners.forEach((l) => l())
      }
    } catch {
      /* offline: keep showing what we had */
    }
  }
  // Nothing configured: no point asking again
  if (state && !state.configured) return
  timer = setTimeout(poll, POLL_MS)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) {
    poll()
    document.addEventListener("visibilitychange", onVisible)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      if (timer) clearTimeout(timer)
      timer = null
      document.removeEventListener("visibilitychange", onVisible)
    }
  }
}

function onVisible() {
  if (document.visibilityState === "visible") poll()
}

export function useNowPlaying() {
  return useSyncExternalStore(subscribe, () => state, () => null)
}

/** Track position, ticking forward locally between polls while playing. */
function useProgress(np: NowPlaying | null) {
  const [now, setNow] = useState(() => Date.now())
  const playing = np?.configured && np.isPlaying && np.track?.durationMs
  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [playing])
  if (!np?.configured || !np.track?.durationMs || np.track.progressMs == null) return null
  const elapsed = np.isPlaying ? now - np.fetchedAt : 0
  const pos = Math.min(np.track.progressMs + elapsed, np.track.durationMs)
  return { pos, duration: np.track.durationMs, fraction: pos / np.track.durationMs }
}

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

/** Three bouncing bars: the "playing" indicator. */
export function Equalizer({ className }: { className?: string }) {
  return (
    <span className={cn("flex h-3 items-end gap-[2px]", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom animate-[eq_0.9s_ease-in-out_infinite] rounded-full bg-current"
          style={{ height: "100%", animationDelay: `${i * -0.3}s` }}
        />
      ))}
    </span>
  )
}

export function AlbumArt({ src, className }: { src?: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-[#1db954] to-[#0f7a37] shadow-md",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <MusicNotesSimple weight="fill" className="h-1/2 w-1/2 text-white/90" />
      )}
    </span>
  )
}

/** Status line above the track: "Now Playing" with bars, or "Last Played". */
export function NowPlayingLabel({ playing }: { playing: boolean }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide",
        playing ? "text-[#1db954]" : "text-muted-foreground",
      )}
    >
      {playing && <Equalizer className="h-2.5" />}
      {playing ? "Now Playing" : "Last Played"}
    </span>
  )
}

/** The desktop widget's contents. Renders nothing until there's a track to show. */
export function NowPlayingBody() {
  const np = useNowPlaying()
  const progress = useProgress(np)
  if (!np?.configured || !np.track) return null
  const { track, isPlaying } = np

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <AlbumArt src={track.art} className="h-14 w-14 rounded-[10px]" />
        <div className="min-w-0 flex-1">
          <NowPlayingLabel playing={isPlaying} />
          <p className="mt-1 truncate text-[13px] font-semibold leading-tight text-foreground">{track.title}</p>
          <p className="truncate text-[12px] leading-tight text-muted-foreground">{track.artist}</p>
        </div>
        {track.url && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 self-start text-muted-foreground" />}
      </div>
      {progress && (
        <div className="flex items-center gap-2 text-[10px] tabular-nums text-muted-foreground">
          <span className="w-7">{fmt(progress.pos)}</span>
          <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-foreground/60 transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress.fraction * 100}%` }}
            />
          </span>
          <span className="w-7 text-right">{fmt(progress.duration)}</span>
        </div>
      )}
    </div>
  )
}
