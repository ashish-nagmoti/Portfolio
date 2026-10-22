"use client"

import { useEffect, useState, type ReactNode } from "react"
import { motion, type Variants } from "framer-motion"
import { Trophy, GithubLogo, Quotes } from "@phosphor-icons/react"
import { APPS, RESUME_ICON } from "../app-registry"
import { AppIcon, type AppIconKey } from "../app-icon"
import { ControlCenterGlyph } from "../control-center"
import { GitHubCard } from "../github-card"
import { SURFACE, GH_USER, LEVEL_FILL, useContributions } from "../widgets"
import type { AppId } from "../types"
import { cn } from "@/lib/utils"

/*
 * The phone layout: an iOS-style home screen in place of the desktop. Widgets
 * and icons share one grid (4 columns upright, 8 sideways) the way iOS lines
 * widgets up with app icons, and the four main apps sit in the dock.
 */

const DOCK_APPS: AppId[] = ["about", "projects", "blog", "contact"]
const GRID_APPS: AppIconKey[] = ["terminal", "interests", "resume"]

// Short names for under the icons ("About.txt" reads oddly on a phone)
const LABELS: Record<AppIconKey, string> = {
  about: "About",
  projects: "Projects",
  terminal: "Terminal",
  contact: "Contact",
  blog: "Blog",
  interests: "Interests",
  resume: "Resume",
}

const appear: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 380, damping: 26 } },
}

/** A widget tile: glass card, presses in slightly when tapped. */
function Tile({
  className,
  onClick,
  label,
  children,
}: {
  className?: string
  onClick?: () => void
  label?: string
  children: ReactNode
}) {
  const Comp = onClick ? motion.button : motion.div
  return (
    <Comp
      variants={appear}
      onClick={onClick}
      aria-label={label}
      whileTap={onClick ? { scale: 0.96 } : undefined}
      className={cn(SURFACE, "flex flex-col p-4 text-left", className)}
    >
      {children}
    </Comp>
  )
}

function ProfileWidget({ onOpen }: { onOpen: () => void }) {
  return (
    <Tile className="col-span-4 justify-between gap-3" onClick={onOpen} label="Open About">
      <div className="flex items-center gap-3">
        <AppIcon app="about" className="h-[52px] w-[52px] shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-[17px] font-bold leading-tight tracking-[-0.01em] text-foreground">Ashish Nagmoti</p>
          <p className="truncate text-[13px] text-muted-foreground">AI Engineer &amp; Researcher</p>
          <p className="truncate text-[12px] text-muted-foreground/80">LLM inference · RAG · AI security</p>
        </div>
      </div>
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        At ESDS Software Solution · Maharashtra
      </span>
    </Tile>
  )
}

function CalendarWidget() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => setNow(new Date()), [])
  return (
    <Tile className="col-span-2 aspect-square justify-between">
      <p className="text-[12px] font-bold uppercase tracking-wide text-red-500">
        {now ? now.toLocaleDateString("en-US", { weekday: "long" }) : " "}
      </p>
      <p className="text-[52px] font-light leading-none tracking-tight text-foreground">{now ? now.getDate() : " "}</p>
      <p className="text-[12px] text-muted-foreground">
        {now ? now.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : " "}
      </p>
    </Tile>
  )
}

function StatsWidget({ onOpen }: { onOpen: () => void }) {
  return (
    <Tile className="col-span-2 aspect-square justify-evenly" onClick={onOpen} label="Open About for coding profiles">
      <div>
        <p className="flex items-center gap-1.5 text-[26px] font-bold leading-none text-foreground">
          <Trophy weight="fill" className="h-5 w-5 text-amber-500" />
          100+
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground">LeetCode solved</p>
      </div>
      <div>
        <p className="flex items-center gap-1.5 text-[26px] font-bold leading-none text-foreground">
          <GithubLogo weight="fill" className="h-5 w-5" />
          45+
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground">GitHub repos</p>
      </div>
    </Tile>
  )
}

function ContributionsWidget() {
  const { data, failed, weeks } = useContributions()
  const [cardOpen, setCardOpen] = useState(false)
  // A phone is narrower than a year of weeks: show the most recent ~half year,
  // at a cell size that's actually readable.
  const recent = weeks.slice(-26)
  return (
    <>
      <Tile className="col-span-4 gap-3" onClick={() => setCardOpen(true)} label="Show GitHub profile">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            <GithubLogo weight="fill" className="h-3.5 w-3.5 text-foreground" />
            Contributions
          </span>
          <span className="text-[12px] text-muted-foreground">
            {failed ? "unavailable" : data ? <><b className="font-semibold text-foreground">{data.total}</b> this year</> : "loading…"}
          </span>
        </div>
        <div className="flex justify-between" aria-hidden>
          {recent.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <span key={day?.date ?? `${wi}-${di}`} className={cn("h-[8px] w-[8px] rounded-[2px]", LEVEL_FILL[day?.level ?? 0])} />
              ))}
            </div>
          ))}
        </div>
      </Tile>
      <GitHubCard open={cardOpen} onClose={() => setCardOpen(false)} user={GH_USER} contributions={data?.total} />
    </>
  )
}

function MantraWidget() {
  return (
    <Tile className="col-span-4">
      <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Quotes weight="fill" className="h-3.5 w-3.5 text-amber-500" />
        Mantra
      </span>
      <p className="mt-2 text-[17px] font-medium italic leading-snug text-foreground">Life works in mysterious ways.</p>
    </Tile>
  )
}

/** An app icon with its label underneath, iOS-style. */
function HomeIcon({ app, onOpen, showLabel = true }: { app: AppIconKey; onOpen: (rect: DOMRect) => void; showLabel?: boolean }) {
  return (
    <motion.button
      variants={appear}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => onOpen((e.currentTarget.firstElementChild as HTMLElement).getBoundingClientRect())}
      aria-label={app === "resume" ? RESUME_ICON.title : APPS[app].title}
      className="flex flex-col items-center gap-1.5"
    >
      <AppIcon app={app} className="h-[60px] w-[60px]" />
      {showLabel && (
        <span className="max-w-full truncate text-[11.5px] font-medium text-black/80 [text-shadow:0_1px_2px_rgba(255,255,255,0.4)] dark:text-white dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
          {LABELS[app]}
        </span>
      )}
    </motion.button>
  )
}

export function HomeScreen({
  onOpenApp,
  onOpenControlCenter,
  focus,
}: {
  onOpenApp: (id: AppId, rect?: DOMRect) => void
  onOpenControlCenter: () => void
  /** Control Center's Focus: just the icons, no widgets */
  focus: boolean
}) {
  const open = (app: AppIconKey) => (rect: DOMRect) => {
    if (app === "resume") window.open(RESUME_ICON.href, "_blank", "noopener")
    else onOpenApp(app, rect)
  }

  return (
    <div className="absolute inset-0 overflow-y-auto overscroll-contain">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.035 } } }}
        className="mx-auto grid w-full max-w-[460px] grid-cols-4 gap-x-[22px] gap-y-5 px-6 pb-[calc(env(safe-area-inset-bottom)+128px)] pt-[calc(env(safe-area-inset-top)+12px)] landscape:max-w-[820px] landscape:grid-cols-8 landscape:gap-x-5 landscape:pb-[calc(env(safe-area-inset-bottom)+24px)]"
      >
        {/* Top row: Control Center sits top-right, where iOS pulls it down from */}
        <div className="col-span-4 flex items-center justify-end landscape:col-span-8">
          <motion.button
            variants={appear}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenControlCenter}
            aria-label="Control Center"
            className={cn(SURFACE, "flex h-9 w-9 items-center justify-center rounded-full text-foreground/85")}
          >
            <ControlCenterGlyph className="h-4 w-4" />
          </motion.button>
        </div>

        {!focus && (
          <>
            <ProfileWidget onOpen={() => onOpenApp("about")} />
            <CalendarWidget />
            <StatsWidget onOpen={() => onOpenApp("about")} />
            <ContributionsWidget />
          </>
        )}
        {/* Sideways the screen is too short for a dock: its apps join the grid */}
        {DOCK_APPS.map((app) => (
          <div key={app} className="hidden landscape:block">
            <HomeIcon app={app} onOpen={open(app)} />
          </div>
        ))}
        {GRID_APPS.map((app) => (
          <HomeIcon key={app} app={app} onOpen={open(app)} />
        ))}
        {!focus && <MantraWidget />}
      </motion.div>

      {/* Dock */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex justify-center px-3 landscape:hidden pb-[calc(env(safe-area-inset-bottom)+10px)]">
        <motion.nav
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
          aria-label="Dock"
          className={cn(
            SURFACE,
            "pointer-events-auto grid w-full max-w-[420px] grid-cols-4 justify-items-center rounded-[32px] px-4 py-3",
          )}
        >
          {DOCK_APPS.map((app) => (
            <HomeIcon key={app} app={app} onOpen={open(app)} showLabel={false} />
          ))}
        </motion.nav>
      </div>
    </div>
  )
}
