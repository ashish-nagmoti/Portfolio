"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowSquareOut, Folder, MagnifyingGlass, NotePencil, PushPin } from "@phosphor-icons/react"
import type { MediumFeed } from "@/lib/medium"
import { cn } from "@/lib/utils"

type Note = {
  id: string
  title: string
  excerpt: string
  date: string | null
  readTime: string
  url: string | null
  tags: string[]
  folder: string
  pinned?: boolean
  /** Full story HTML, sanitized server-side. Absent until the live feed arrives. */
  html?: string
}

// Sorts a story into a folder by its Medium tags; first matching rule wins.
const FOLDER_RULES: [string, string[]][] = [
  ["Cloud", ["aws", "cloud-computing", "cloud"]],
  ["Linux", ["linux"]],
  ["Open Source", ["open-source", "github", "hacktoberfest"]],
  ["Learning", ["python", "web-development", "cs50", "learning"]],
]
const folderFor = (tags: string[]) =>
  FOLDER_RULES.find(([, keys]) => keys.some((k) => tags.includes(k)))?.[0] ?? "Writing"

const DRAFT: Note = {
  id: "draft",
  title: "In progress",
  excerpt: "Working on more in-depth articles about AI engineering, cloud architecture and backend development.",
  date: null,
  readTime: "Draft",
  url: null,
  tags: ["drafts"],
  folder: "Drafts",
  pinned: true,
}

// Shown instantly, and kept if the live feed can't be reached. IDs are Medium's
// own post IDs, so a selection survives the swap to live stories.
const FALLBACK: Note[] = [
  {
    id: "b2767d9dde5b",
    title: "Common Pitfalls While Setting Up an AWS Account",
    excerpt:
      "While helping a freelancing client set up his AWS account, I realized something — there's a serious lack of practical, experience-based guidance out there for beginners.",
    date: "2025-07-22",
    readTime: "3 min read",
    url: "https://medium.com/@ashishnagmoti7/common-pitfalls-while-setting-up-an-aws-account-b2767d9dde5b",
    tags: ["aws", "cloud-computing"],
    folder: "Cloud",
  },
  {
    id: "cca16df9c2a7",
    title: "I switched to Arch Linux",
    excerpt: "I followed instructions from this video, had to Google a few things, and did some wiki reading.",
    date: "2025-01-30",
    readTime: "6 min read",
    url: "https://medium.com/@ashishnagmoti7/i-switched-to-arch-linux-cca16df9c2a7",
    tags: ["linux", "open-source"],
    folder: "Linux",
  },
  {
    id: "44b5b8826c4d",
    title: "My CS50 experience",
    excerpt:
      "A few months ago, I was completely clueless about what to do in my programming journey. Then, due to advice from some YouTubers and friends, I embarked on my CS50 journey.",
    date: "2024-06-21",
    readTime: "2 min read",
    url: "https://long.sweet.pub/my-cs50-experience-44b5b8826c4d",
    tags: ["python", "web-development"],
    folder: "Learning",
  },
  {
    id: "14d6faf8649b",
    title: "My Hacktoberfest Journey: Navigating Challenges and Embracing Growth",
    excerpt: "Hey there! I'm Ashish, a proud contributor to Hacktoberfest 2023.",
    date: "2023-11-08",
    readTime: "1 min read",
    url: "https://medium.com/@ashishnagmoti7/my-hacktoberfest-journey-navigating-challenges-and-embracing-growth-14d6faf8649b",
    tags: ["open-source", "github"],
    folder: "Open Source",
  },
]

const ALL = "All Posts"

// Notes' yellow: darker on white so it stays legible, brighter on dark.
const YELLOW_TEXT = "text-[#c99a00] dark:text-[#ffd60a]"

const longDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
const shortDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })

/**
 * The blog, as Apple Notes: folders on the left, a note list grouped by year
 * (with Pinned on top) in the middle, and the selected story on the right.
 * Stories are read in full here, from the live Medium feed via /api/medium.
 */
export function BlogApp() {
  const [stories, setStories] = useState<Note[]>(FALLBACK)
  const [source, setSource] = useState<"loading" | "live" | "offline">("loading")
  const [folder, setFolder] = useState(ALL)
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(FALLBACK[0].id)

  useEffect(() => {
    let alive = true
    fetch("/api/medium")
      .then((r) => (r.ok ? (r.json() as Promise<MediumFeed>) : Promise.reject(new Error(String(r.status)))))
      .then((feed) => {
        if (!alive) return
        if (!feed.posts.length) return setSource("offline")
        setStories(
          feed.posts.map((p) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            date: p.date,
            readTime: `${p.readMinutes} min read`,
            url: p.url,
            tags: p.tags,
            folder: folderFor(p.tags),
            html: p.html,
          })),
        )
        setSource("live")
      })
      .catch(() => alive && setSource("offline"))
    return () => {
      alive = false
    }
  }, [])

  const notes = useMemo(() => [DRAFT, ...stories], [stories])
  const folders = useMemo(() => {
    const present = new Set(notes.map((n) => n.folder))
    const ordered = [...FOLDER_RULES.map(([f]) => f), "Writing", "Drafts"].filter((f) => present.has(f))
    return [ALL, ...ordered]
  }, [notes])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notes.filter(
      (n) =>
        (folder === ALL || n.folder === folder) &&
        (!q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)),
    )
  }, [notes, folder, query])

  const groups = useMemo(() => {
    const out: { label: string; items: Note[] }[] = []
    const pinned = visible.filter((n) => n.pinned)
    if (pinned.length) out.push({ label: "Pinned", items: pinned })
    const dated = visible.filter((n) => !n.pinned && n.date).sort((a, b) => (a.date! < b.date! ? 1 : -1))
    for (const n of dated) {
      const year = n.date!.slice(0, 4)
      const g = out.find((x) => x.label === year)
      if (g) g.items.push(n)
      else out.push({ label: year, items: [n] })
    }
    return out
  }, [visible])

  const selected = visible.find((n) => n.id === selectedId) ?? visible[0] ?? null
  const count = (f: string) => (f === ALL ? notes.length : notes.filter((n) => n.folder === f).length)

  return (
    <div className="flex h-full text-[13px]">
      {/* Folders */}
      <aside className="hidden w-[176px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-black/[0.08] bg-[#f1f1f2] p-2 dark:border-white/[0.08] dark:bg-[#252527] sm:flex">
        <p className="px-2 pb-1 pt-2 text-[11px] font-semibold text-muted-foreground">iCloud</p>
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
              folder === f ? "bg-black/[0.08] dark:bg-white/[0.1]" : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]",
            )}
          >
            <Folder className={cn("h-4 w-4 shrink-0", YELLOW_TEXT)} />
            <span className="flex-1 truncate">{f}</span>
            <span className="tabular-nums text-muted-foreground">{count(f)}</span>
          </button>
        ))}
      </aside>

      {/* Note list */}
      <section className="flex w-[250px] shrink-0 flex-col border-r border-black/[0.08] bg-background/40 dark:border-white/[0.08]">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold">{folder}</p>
            <p className="text-[11px] text-muted-foreground">
              {visible.length} {visible.length === 1 ? "note" : "notes"}
            </p>
          </div>
          <NotePencil className={cn("h-5 w-5 shrink-0", YELLOW_TEXT)} aria-hidden />
        </div>
        <div className="px-3 pb-2">
          <label className="flex items-center gap-1.5 rounded-md bg-black/[0.05] px-2 py-1 dark:bg-white/[0.08]">
            <MagnifyingGlass className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search notes"
              className="w-full bg-transparent text-[12px] outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {groups.map((g) => (
            <div key={g.label} className="mb-2">
              <p className="flex items-center gap-1 px-2 pb-1 pt-2 text-[11px] font-bold text-muted-foreground">
                {g.label === "Pinned" && <PushPin weight="fill" className="h-3 w-3" />}
                {g.label}
              </p>
              {g.items.map((n) => {
                const active = selected?.id === n.id
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedId(n.id)}
                    className={cn(
                      "block w-full rounded-lg px-2.5 py-2 text-left transition-colors",
                      active
                        ? "bg-[#ffd60a] text-black dark:bg-[#8a6c00] dark:text-white"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]",
                    )}
                  >
                    <p className="truncate font-semibold">{n.title}</p>
                    <p className={cn("truncate text-[12px]", active ? "text-black/70 dark:text-white/75" : "text-muted-foreground")}>
                      <span className="mr-1.5 tabular-nums">{n.date ? shortDate(n.date) : n.readTime}</span>
                      {n.excerpt}
                    </p>
                  </button>
                )
              })}
            </div>
          ))}
          {visible.length === 0 && <p className="px-3 py-8 text-center text-muted-foreground">No notes</p>}
        </div>
      </section>

      {/* Note */}
      <article className="flex min-w-0 flex-1 flex-col bg-card">
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-black/[0.06] px-4 dark:border-white/[0.06]">
          <span className="truncate text-[11px] text-muted-foreground">
            {source === "loading" ? "Loading from Medium…" : source === "live" ? "From Medium" : "Offline copy"}
          </span>
          {selected?.url && (
            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-medium hover:bg-black/[0.05] dark:hover:bg-white/[0.08]",
                YELLOW_TEXT,
              )}
            >
              Open in Medium
              <ArrowSquareOut className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {selected ? (
          <div key={selected.id} className="flex-1 overflow-y-auto px-8 py-6">
            <p className="text-center text-[11px] text-muted-foreground">
              {selected.date ? longDate(selected.date) : "Draft"}
              {selected.date ? ` · ${selected.readTime}` : ""}
            </p>
            <h1 className="mt-4 text-[24px] font-bold leading-tight tracking-tight">{selected.title}</h1>
            {selected.html ? (
              // Sanitized in app/api/medium/route.ts (tag/attribute allowlist, https links only).
              <div className="note-body mt-5" dangerouslySetInnerHTML={{ __html: selected.html }} />
            ) : (
              <p className="mt-4 text-[14px] leading-relaxed text-foreground/85">{selected.excerpt}</p>
            )}
            <p className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-[13px] font-medium">
              {selected.tags.slice(0, 5).map((t) => (
                <span key={t} className={YELLOW_TEXT}>
                  #{t}
                </span>
              ))}
            </p>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">No note selected</div>
        )}
      </article>
    </div>
  )
}
