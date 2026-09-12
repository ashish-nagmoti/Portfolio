"use client"

import { useEffect, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { MapPin, Trophy, Github, FolderGit2, Hammer, BookOpen, Youtube } from "lucide-react"
import type { AppId } from "./types"
import { cn } from "@/lib/utils"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

const SURFACE =
  "rounded-[22px] border border-white/50 bg-white/55 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/35"

function Widget({
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
  const shared = cn(SURFACE, "p-4 text-left", className)

  if (!onClick) {
    return (
      <motion.div variants={itemVariants} className={shared}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={shared}
    >
      {children}
    </motion.button>
  )
}

/** macOS Calendar widget: red weekday band over a large day number. */
function CalendarWidget() {
  // Rendered client-side only so the server and client markup can't disagree.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  return (
    <Widget className="flex flex-col justify-center">
      <p className="text-[11px] font-bold uppercase tracking-wide text-red-500">
        {now ? now.toLocaleDateString("en-US", { weekday: "long" }) : " "}
      </p>
      <p className="mt-0.5 text-4xl font-bold leading-none tracking-tight text-foreground">
        {now ? now.getDate() : " "}
      </p>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {now ? now.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : " "}
      </p>
    </Widget>
  )
}

function LocationWidget() {
  return (
    <Widget className="flex flex-col justify-center">
      <MapPin className="h-4 w-4 text-sky-500" />
      <p className="mt-2 text-sm font-semibold leading-tight text-foreground">Maharashtra</p>
      <p className="text-[11px] text-muted-foreground">India</p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Open to work</span>
      </div>
    </Widget>
  )
}

const STATS = [
  { icon: Trophy, label: "LeetCode", value: "100+", sub: "solved", tint: "text-amber-500" },
  { icon: Github, label: "GitHub", value: "50+", sub: "repos", tint: "text-foreground" },
]

function StatsWidget({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  return (
    <Widget className="col-span-2" onClick={() => onOpenApp("about")} label="Open About for coding profiles">
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((s) => (
          <div key={s.label}>
            <s.icon className={cn("h-4 w-4", s.tint)} />
            <p className="mt-2 text-xl font-bold leading-none text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">
              {s.label} {s.sub}
            </p>
          </div>
        ))}
      </div>
    </Widget>
  )
}

function ProjectWidget({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  return (
    <Widget className="col-span-2" onClick={() => onOpenApp("projects")} label="Open Projects">
      <div className="flex items-center gap-2">
        <FolderGit2 className="h-3.5 w-3.5 text-sky-500" />
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Featured</p>
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug text-foreground">StoryMail</p>
      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
        AI-powered email platform — classification, digests and querying.
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {["Django", "Gemini API", "Postgres"].map((t) => (
          <span
            key={t}
            className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground dark:bg-white/10"
          >
            {t}
          </span>
        ))}
      </div>
    </Widget>
  )
}

/**
 * What Ashish is on right now. Seeded from the featured project and the saved
 * items in the Interests app — update these as they change.
 */
const CURRENTLY = [
  {
    label: "Building",
    value: "StoryMail",
    icon: Hammer,
    tint: "text-violet-500",
    app: "projects" as AppId,
  },
  {
    label: "Reading",
    value: "Kubernetes Networking",
    icon: BookOpen,
    tint: "text-sky-500",
    app: "interests" as AppId,
  },
  {
    label: "Watching",
    value: "Production-Ready APIs",
    icon: Youtube,
    tint: "text-rose-500",
    app: "interests" as AppId,
  },
]

function CurrentlyWidget({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  return (
    <Widget className="col-span-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Currently</p>
      <div className="mt-2.5 space-y-1">
        {CURRENTLY.map((row) => (
          <button
            key={row.label}
            onClick={() => onOpenApp(row.app)}
            aria-label={`${row.label}: ${row.value}`}
            className="flex w-full items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            <row.icon className={cn("h-4 w-4 shrink-0", row.tint)} />
            <span className="min-w-0">
              <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {row.label}
              </span>
              <span className="block truncate text-[12px] font-semibold leading-tight text-foreground">
                {row.value}
              </span>
            </span>
          </button>
        ))}
      </div>
    </Widget>
  )
}

const STACK = ["Python", "Django", "FastAPI", "AWS", "GCP", "LLMs"]

function StackWidget({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  return (
    <Widget className="col-span-2" onClick={() => onOpenApp("about")} label="Open About for full skill list">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Stack</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {STACK.map((t) => (
          <span
            key={t}
            className="rounded-lg bg-black/5 px-2 py-1 text-[11px] font-medium text-foreground/80 dark:bg-white/10"
          >
            {t}
          </span>
        ))}
      </div>
    </Widget>
  )
}

// A widget column: narrow, pinned between the menu bar and the Dock. Hidden on
// short viewports (a landscape phone), which lack the room to show a widget
// without clipping it.
const COLUMN = "absolute top-11 bottom-24 z-0 grid w-[268px] auto-rows-min grid-cols-2 gap-3 [@media(max-height:560px)]:hidden"

/**
 * The desktop's widgets, in place of app icons — every app is still reachable
 * from the Dock and Spotlight. Split across both edges so the desktop isn't
 * lopsided; the left column drops out on narrower screens, where an open
 * window would sit on top of it anyway.
 */
export function DesktopWidgets({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(COLUMN, "left-4 overflow-y-auto pl-1 max-lg:hidden")}
      >
        <CurrentlyWidget onOpenApp={onOpenApp} />
        <StackWidget onOpenApp={onOpenApp} />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(COLUMN, "right-4 overflow-y-auto pr-1")}
      >
        <CalendarWidget />
        <LocationWidget />
        <StatsWidget onOpenApp={onOpenApp} />
        <ProjectWidget onOpenApp={onOpenApp} />
      </motion.div>
    </>
  )
}
