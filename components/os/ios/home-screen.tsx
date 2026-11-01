"use client"

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { motion, type Variants } from "framer-motion"
import {
  Trophy,
  GithubLogo,
  Quotes,
  EnvelopeSimple,
  FilePdf,
  LinkedinLogo,
  MagnifyingGlass,
  NotePencil,
  Clock,
  PuzzlePiece,
} from "@phosphor-icons/react"
import { PuzzleBoard } from "../puzzle"
import { APPS, RESUME_ICON } from "../app-registry"
import { AppIcon, type AppIconKey } from "../app-icon"
import { ControlCenterGlyph } from "../control-center"
import { GitHubCard } from "../github-card"
import { SURFACE, GH_USER, LEVEL_FILL, useContributions } from "../widgets"
import type { AppId } from "../types"
import type { MediumFeed } from "@/lib/medium"
import { cn } from "@/lib/utils"
import { siteContent, CURRENTLY_LABEL } from "@/lib/site-content"
import { CURRENTLY_META, FEATURED_ICON } from "../content-meta"

/*
 * The phone layout: an iOS-style home screen in place of the desktop.
 *
 * Pages, swiped sideways (CSS scroll-snap, so it's the browser's own
 * native-feeling paging): first who Ashish is plus the apps, then what he's
 * doing, made and written, then the puzzle and mantra. The widgets are dealt
 * onto as many pages as the screen needs, so no page has to scroll. Widgets
 * and icons share one grid (4 columns upright, 8 sideways) the way iOS lines
 * widgets up with icons. Above the dock
 * sits the iOS 18 "Search" pill, which turns into page dots while swiping;
 * pulling down on the home screen also opens search.
 */

const EMAIL = "ashishnagmoti2310@gmail.com"
const LINKEDIN = "https://www.linkedin.com/in/ashish-nagmoti-54269b249"
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

// The home screen's widget groups in reading order, and how they split by default:
// three pages on a tall phone. HomeScreen re-deals them to fit the actual screen.
type Block = "profile" | "glance" | "contributions" | "apps" | "currently" | "featured" | "latest" | "puzzle" | "mantra"
const DEFAULT_PAGES: Block[][] = [
  ["profile", "glance", "contributions", "apps"],
  ["currently", "featured", "latest"],
  ["puzzle", "mantra"],
]
// Control Center's Focus: just the icons
const FOCUS_PAGES: Block[][] = [["apps"]]

const LABEL = "flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground"

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

/** The hero: who, what, and the three things a recruiter wants one tap away. */
function ProfileCard({ onOpen }: { onOpen: () => void }) {
  const actions = [
    { label: "Email", icon: EnvelopeSimple, href: `mailto:${EMAIL}` },
    { label: "Résumé", icon: FilePdf, href: RESUME_ICON.href },
    { label: "LinkedIn", icon: LinkedinLogo, href: LINKEDIN },
  ]
  return (
    <motion.div variants={appear} className={cn(SURFACE, "col-span-4 p-4")}>
      <motion.button whileTap={{ scale: 0.98 }} onClick={onOpen} aria-label="Open About" className="flex w-full items-center gap-3 text-left">
        <AppIcon app="about" className="h-[56px] w-[56px] shrink-0" />
        <span className="min-w-0">
          <span className="block truncate text-[19px] font-bold leading-tight tracking-[-0.01em] text-foreground">Ashish Nagmoti</span>
          <span className="block truncate text-[13.5px] text-muted-foreground">AI Engineer &amp; Researcher · ESDS</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {siteContent.status}
          </span>
        </span>
      </motion.button>
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {actions.map((a) => (
          <motion.a
            key={a.label}
            whileTap={{ scale: 0.94 }}
            href={a.href}
            target={a.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 rounded-[14px] bg-black/[0.06] py-2 text-[12px] font-medium text-foreground dark:bg-white/[0.1]"
          >
            <a.icon weight="fill" className="h-[18px] w-[18px] text-primary" />
            {a.label}
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}

/** Ashish's local time: handy when you're about to message him. */
function LocalTimeWidget() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])
  const parts = now
    ? new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(now)
    : []
  const time = parts.filter((p) => p.type !== "dayPeriod").map((p) => p.value).join("").trim()
  const period = parts.find((p) => p.type === "dayPeriod")?.value
  const day = now?.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" })
  return (
    <Tile className="col-span-2 aspect-square justify-between">
      <span className={LABEL}>
        <Clock weight="fill" className="h-3.5 w-3.5 text-sky-500" />
        Local time
      </span>
      <span>
        <span className="flex items-baseline gap-1 text-[clamp(30px,10vw,40px)] font-light leading-none tracking-tight text-foreground tabular-nums">
          {time || " "}
          <span className="text-[15px] font-medium text-muted-foreground">{period}</span>
        </span>
        <span className="mt-1 block text-[12px] text-muted-foreground">{day ?? " "}</span>
      </span>
      <span className="text-[12px] font-medium text-foreground/80">Maharashtra · IST</span>
    </Tile>
  )
}

function StatsWidget({ onOpen }: { onOpen: () => void }) {
  return (
    <Tile className="col-span-2 aspect-square justify-evenly" onClick={onOpen} label="Open About for coding profiles">
      <div>
        <p className="flex items-center gap-1.5 text-[26px] font-bold leading-none text-foreground">
          <Trophy weight="fill" className="h-5 w-5 text-amber-500" />
          {siteContent.stats.leetcode}
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground">LeetCode solved</p>
      </div>
      <div>
        <p className="flex items-center gap-1.5 text-[26px] font-bold leading-none text-foreground">
          <GithubLogo weight="fill" className="h-5 w-5" />
          {siteContent.stats.repos}
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
          <span className={LABEL}>
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

function FeaturedWidget({ onOpen }: { onOpen: () => void }) {
  const f = siteContent.featured
  const Icon = FEATURED_ICON[f.icon]
  return (
    <Tile className="col-span-4 gap-2.5" onClick={onOpen} label={`Open Projects: ${f.name}`}>
      <span className={LABEL}>
        <Trophy weight="fill" className="h-3.5 w-3.5 text-amber-500" />
        Featured{f.badge ? ` · ${f.badge}` : ""}
      </span>
      <span className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-b from-[#3d9bff] to-[#0a6cff] text-white shadow-md">
          <Icon weight="fill" className="h-7 w-7" />
        </span>
        <span className="min-w-0">
          <span className="block text-[17px] font-bold leading-tight text-foreground">{f.name}</span>
          <span className="block text-[13px] leading-snug text-muted-foreground">{f.summary}</span>
        </span>
      </span>
    </Tile>
  )
}

/** What Ashish is on right now; edited from /admin. */
function CurrentlyWidget({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  if (siteContent.currently.length === 0) return null
  return (
    <Tile className="col-span-4 gap-1.5">
      <span className={LABEL}>Currently</span>
      {siteContent.currently.map((row, i) => {
        const meta = CURRENTLY_META[row.kind]
        return (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={() => (row.url ? window.open(row.url, "_blank", "noopener,noreferrer") : onOpenApp(meta.app))}
            className="flex w-full items-center gap-3 rounded-xl py-1.5 text-left"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-black/[0.06] dark:bg-white/[0.1]">
              <meta.icon weight="fill" className={cn("h-[18px] w-[18px]", meta.tint)} />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{CURRENTLY_LABEL[row.kind]}</span>
              <span className="block truncate text-[15px] font-semibold leading-tight text-foreground">{row.value}</span>
            </span>
          </motion.button>
        )
      })}
    </Tile>
  )
}

/** The newest Medium story, from the same feed the Blog app reads. */
function LatestPostWidget({ onOpen }: { onOpen: () => void }) {
  const [post, setPost] = useState({
    title: "Common Pitfalls While Setting Up an AWS Account",
    date: "2025-07-22",
    excerpt: "While helping a freelancing client set up his AWS account, I realized something…",
  })
  useEffect(() => {
    let alive = true
    fetch("/api/medium")
      .then((r) => (r.ok ? (r.json() as Promise<MediumFeed>) : null))
      .then((feed) => {
        const latest = feed?.posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0]
        if (alive && latest) setPost({ title: latest.title, date: latest.date, excerpt: latest.excerpt })
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  const date = new Date(post.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  return (
    <Tile className="col-span-4 gap-2" onClick={onOpen} label={`Open Blog: ${post.title}`}>
      <span className={LABEL}>
        <NotePencil weight="fill" className="h-3.5 w-3.5 text-[#ffcc00]" />
        Latest post · {date}
      </span>
      <span className="text-[17px] font-bold leading-snug text-foreground">{post.title}</span>
      <span className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">{post.excerpt}</span>
    </Tile>
  )
}

function MantraWidget() {
  return (
    <Tile className="col-span-4">
      <span className={LABEL}>
        <Quotes weight="fill" className="h-3.5 w-3.5 text-amber-500" />
        Mantra
      </span>
      <p className="mt-2 text-[19px] font-medium italic leading-snug text-foreground">{siteContent.mantra}</p>
    </Tile>
  )
}

/** An app icon with its label underneath, iOS-style. */
function HomeIcon({ app, onOpen, showLabel = true }: { app: AppIconKey; onOpen: (rect: DOMRect) => void; showLabel?: boolean }) {
  return (
    <motion.button
      variants={appear}
      whileTap={{ scale: 0.88 }}
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

// Pages are filled to fit the screen; scrolling is only a fallback for very
// short ones and sideways. The grid is padded clear of the notch and dock
// Content fades out as it scrolls under the date bar and the dock, instead of colliding with them
const PAGE =
  "h-full w-full shrink-0 snap-start snap-always overflow-y-auto overscroll-contain [mask-image:linear-gradient(to_bottom,transparent_calc(env(safe-area-inset-top)+34px),black_calc(env(safe-area-inset-top)+58px),black_calc(100%-150px),transparent_calc(100%-96px))] landscape:[mask-image:linear-gradient(to_bottom,transparent_calc(env(safe-area-inset-top)+34px),black_calc(env(safe-area-inset-top)+58px))] [@media(max-height:780px)]:[mask-image:linear-gradient(to_bottom,transparent_calc(env(safe-area-inset-top)+34px),black_calc(env(safe-area-inset-top)+58px),black_calc(100%-108px),transparent_calc(100%-92px))]"
const GRID =
  "mx-auto grid w-full max-w-[460px] auto-rows-min grid-cols-4 gap-x-[22px] gap-y-5 px-6 pt-[calc(env(safe-area-inset-top)+60px)] pb-[calc(env(safe-area-inset-bottom)+160px)] [@media(max-height:780px)]:gap-y-3.5 [@media(max-height:780px)]:pt-[calc(env(safe-area-inset-top)+54px)] [@media(max-height:780px)]:pb-[calc(env(safe-area-inset-bottom)+110px)] landscape:max-w-[820px] landscape:grid-cols-8 landscape:gap-x-5 landscape:pb-[calc(env(safe-area-inset-bottom)+64px)]"

export function HomeScreen({
  onOpenApp,
  onOpenControlCenter,
  onOpenSearch,
  focus,
}: {
  onOpenApp: (id: AppId, rect?: DOMRect) => void
  onOpenControlCenter: () => void
  onOpenSearch: () => void
  /** Control Center's Focus: just the icons, no widgets */
  focus: boolean
}) {
  const pagerRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const swipeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [split, setSplit] = useState<Block[][]>(DEFAULT_PAGES)
  const layout = focus ? FOCUS_PAGES : split
  const pages = layout.length
  const [today, setToday] = useState("")
  useEffect(() => setToday(new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })), [])

  const open = (app: AppIconKey) => (rect: DOMRect) => {
    if (app === "resume") window.open(RESUME_ICON.href, "_blank", "noopener")
    else onOpenApp(app, rect)
  }

  // Deal the widget groups onto pages so none has to scroll: measure each group,
  // then fill pages in order until the next group won't fit. Group heights don't
  // depend on which page they're on, so one pass settles. Sideways the screen is
  // too short for this to help, so the default split stays.
  useLayoutEffect(() => {
    const pager = pagerRef.current
    if (!pager || focus) return
    const measure = () => {
      let next = DEFAULT_PAGES
      const grid = pager.querySelector<HTMLElement>("[data-grid]")
      if (grid && !window.matchMedia("(orientation: landscape)").matches) {
        const cs = getComputedStyle(grid)
        const room = grid.parentElement!.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        const gap = parseFloat(cs.rowGap) || 0
        const height = (block: Block) => {
          const items = [...pager.querySelectorAll<HTMLElement>(`[data-block="${block}"] > *`)].filter((el) => el.offsetHeight > 0)
          if (!items.length) return 0
          return Math.max(...items.map((el) => el.offsetTop + el.offsetHeight)) - Math.min(...items.map((el) => el.offsetTop))
        }
        const deal = (order: Block[]) => {
          const dealt: Block[][] = [[]]
          let used = 0
          for (const block of order) {
            const h = height(block)
            if (used && used + gap + h > room) {
              dealt.push([block])
              used = h
            } else {
              dealt[dealt.length - 1].push(block)
              used = used ? used + gap + h : h
            }
          }
          return dealt
        }
        const order = DEFAULT_PAGES.flat()
        next = deal(order)
        // The apps belong on the first page: if they'd spill over, contributions moves on instead
        if (!next[0].includes("apps")) {
          const rest: Block[] = order.filter((b) => b !== "apps")
          rest.splice(rest.indexOf("contributions"), 0, "apps")
          next = deal(rest)
        }
      }
      setSplit((cur) => (JSON.stringify(cur) === JSON.stringify(next) ? cur : next))
    }
    measure()
    // Again when the screen turns or resizes, a widget's content changes, or the fonts land
    const ro = new ResizeObserver(measure)
    ro.observe(pager)
    pager.querySelectorAll("[data-grid]").forEach((g) => ro.observe(g))
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [focus, split])

  const renderBlock = (block: Block): ReactNode => {
    switch (block) {
      case "profile":
        return <ProfileCard onOpen={() => onOpenApp("about")} />
      case "glance":
        return (
          <>
            <LocalTimeWidget />
            <StatsWidget onOpen={() => onOpenApp("about")} />
          </>
        )
      case "contributions":
        return <ContributionsWidget />
      case "apps":
        return (
          <>
            {/* Sideways the screen is too short for a dock: its apps join the grid */}
            {DOCK_APPS.map((app) => (
              <div key={app} className="hidden landscape:block">
                <HomeIcon app={app} onOpen={open(app)} />
              </div>
            ))}
            {GRID_APPS.map((app) => (
              <HomeIcon key={app} app={app} onOpen={open(app)} />
            ))}
          </>
        )
      case "currently":
        return <CurrentlyWidget onOpenApp={onOpenApp} />
      case "featured":
        return <FeaturedWidget onOpen={() => onOpenApp("projects")} />
      case "latest":
        return <LatestPostWidget onOpen={() => onOpenApp("blog")} />
      case "puzzle":
        return (
          <Tile className="col-span-4">
            <PuzzleBoard
              size={184}
              title={
                <span className={LABEL}>
                  <PuzzlePiece weight="fill" className="h-3.5 w-3.5 text-violet-500" />
                  Puzzle
                </span>
              }
              aside={
                <span className="text-[13px] leading-snug text-muted-foreground">
                  Slide the pieces into the gap until the picture is whole. Hold the eye to peek.
                </span>
              }
            />
          </Tile>
        )
      case "mantra":
        return <MantraWidget />
    }
  }

  // While paging, the Search pill shows page dots instead (as on iOS 18)
  const onPagerScroll = () => {
    const el = pagerRef.current
    if (!el) return
    setPage(Math.round(el.scrollLeft / el.clientWidth))
    setSwiping(true)
    clearTimeout(swipeTimer.current)
    swipeTimer.current = setTimeout(() => setSwiping(false), 900)
  }

  // Pull down from the top of page one to search, like the iOS home screen
  const pull = useRef<{ y: number; fired: boolean } | null>(null)
  const [pullY, setPullY] = useState(0)
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    pull.current = e.currentTarget.scrollTop <= 0 ? { y: e.touches[0].clientY, fired: false } : null
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!pull.current || pull.current.fired) return
    const dy = e.touches[0].clientY - pull.current.y
    setPullY(Math.max(0, Math.min(dy, 90)))
    if (dy > 70) {
      pull.current.fired = true
      setPullY(0)
      onOpenSearch()
    }
  }
  const endPull = () => {
    pull.current = null
    setPullY(0)
  }

  return (
    <div className="absolute inset-0">
      {/* Top bar: today's date, and Control Center where iOS pulls it down from */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[460px] items-center justify-between px-6 pt-[calc(env(safe-area-inset-top)+10px)] landscape:max-w-[820px]">
        <span className="text-[13px] font-semibold text-black/70 dark:text-white/85" style={{ opacity: 1 - pullY / 50 }}>
          {today}
        </span>
        <span className="flex gap-2">
          {/* Sideways the Search pill would sit on the widgets, so search lives up here */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onOpenSearch}
            aria-label="Search"
            className={cn(SURFACE, "pointer-events-auto hidden h-9 w-9 items-center justify-center rounded-full text-foreground/85 landscape:flex [@media(max-height:780px)]:flex")}
          >
            <MagnifyingGlass weight="bold" className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onOpenControlCenter}
            aria-label="Control Center"
            className={cn(SURFACE, "pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full text-foreground/85")}
          >
            <ControlCenterGlyph className="h-4 w-4" />
          </motion.button>
        </span>
      </div>

      {/* Pull-to-search hint, fading in as the page is pulled */}
      {pullY > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0 z-10 flex justify-center"
          style={{ top: `calc(env(safe-area-inset-top) + ${12 + pullY / 3}px)`, opacity: pullY / 60 }}
          aria-hidden
        >
          <span className={cn(SURFACE, "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium")}>
            <MagnifyingGlass weight="bold" className="h-3.5 w-3.5" />
            Search
          </span>
        </div>
      )}

      {/* Pages */}
      <div ref={pagerRef} onScroll={onPagerScroll} className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden">
        {layout.map((blocks, i) => (
          <div
            key={i}
            className={PAGE}
            {...(i === 0 ? { onTouchStart, onTouchMove, onTouchEnd: endPull, onTouchCancel: endPull } : {})}
          >
            <motion.div
              data-grid
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: i === 0 ? 0.035 : 0.05 } } }}
              className={GRID}
              style={i === 0 && pullY ? { transform: `translateY(${pullY / 2}px)` } : undefined}
            >
              {/* Each group's widgets sit straight in the grid; the wrapper is only for measuring */}
              {blocks.map((block) => (
                <div key={block} data-block={block} className="contents">
                  {renderBlock(block)}
                </div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* The Search pill (page dots while swiping), then the dock */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        <motion.button
          layout
          onClick={onOpenSearch}
          aria-label="Search"
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
          className={cn(
            SURFACE,
            "pointer-events-auto flex h-8 items-center justify-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium text-foreground/85 landscape:hidden [@media(max-height:780px)]:hidden",
          )}
        >
          {swiping && pages > 1 ? (
            Array.from({ length: pages }, (_, i) => (
              <span
                key={i}
                className={cn("h-[7px] w-[7px] rounded-full transition-colors", i === page ? "bg-foreground/85" : "bg-foreground/30")}
              />
            ))
          ) : (
            <>
              <MagnifyingGlass weight="bold" className="h-3.5 w-3.5" />
              Search
            </>
          )}
        </motion.button>

        <motion.nav
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.1 }}
          aria-label="Dock"
          className={cn(SURFACE, "pointer-events-auto grid w-full max-w-[420px] grid-cols-4 justify-items-center rounded-[32px] px-4 py-3 landscape:hidden")}
        >
          {DOCK_APPS.map((app) => (
            <HomeIcon key={app} app={app} onOpen={open(app)} showLabel={false} />
          ))}
        </motion.nav>
      </div>
    </div>
  )
}
