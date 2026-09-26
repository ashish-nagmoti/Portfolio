"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Github, ExternalLink, X } from "lucide-react"

const PROFILE_CACHE_KEY = "os-gh-profile"
const PROFILE_TTL = 24 * 60 * 60 * 1000 // 24h: GitHub allows 60 unauthenticated calls/hour

export interface GitHubProfile {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  public_repos: number
  followers: number
  following: number
}

function readProfileCache(): GitHubProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    return Date.now() - at < PROFILE_TTL ? data : null
  } catch {
    return null
  }
}

/**
 * A "Get Info"-style card for the GitHub profile, opened from the
 * contributions widget. Shows live profile stats and hands off to GitHub in a
 * new tab, rather than navigating away the moment the widget is clicked.
 */
export function GitHubCard({
  open,
  onClose,
  user,
  contributions,
}: {
  open: boolean
  onClose: () => void
  user: string
  contributions?: number
}) {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const url = `https://github.com/${user}`

  useEffect(() => {
    if (!open) return
    let alive = true
    const cached = readProfileCache()
    if (cached) setProfile(cached)

    fetch(`https://api.github.com/users/${user}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: GitHubProfile) => {
        if (!alive) return
        setProfile(d)
        try {
          localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ at: Date.now(), data: d }))
        } catch {
          /* private mode: skip the cache */
        }
      })
      .catch(() => {
        /* the card still works without live stats */
      })

    return () => {
      alive = false
    }
  }, [open, user])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const stats = profile
    ? [
        { label: "Repos", value: profile.public_repos },
        { label: "Followers", value: profile.followers },
        { label: "Following", value: profile.following },
      ]
    : []

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9850] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            role="dialog"
            aria-label="GitHub profile"
            className="relative w-full max-w-[320px] rounded-2xl border border-black/5 bg-white/95 p-5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#2a2a30]/95"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-3">
              {/* Plain img: avoids needing a next/image remote-pattern for avatars. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile?.avatar_url ?? `https://github.com/${user}.png`}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full border border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/5"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{profile?.name ?? "Ashish Nagmoti"}</p>
                <p className="truncate text-xs text-muted-foreground">@{user}</p>
              </div>
            </div>

            {profile?.bio && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{profile.bio}</p>}

            {stats.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-black/[0.04] p-3 dark:bg-white/[0.06]">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-base font-bold leading-none tabular-nums text-foreground">{s.value}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {contributions !== undefined && (
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">{contributions}</span> contributions in the past year
              </p>
            )}

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-3 py-2.5 text-xs font-semibold text-background transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              <Github className="h-4 w-4" />
              Open on GitHub
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">Opens in a new tab</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
