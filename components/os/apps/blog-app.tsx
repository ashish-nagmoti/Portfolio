"use client"

import { useMemo, useState } from "react"
import { ArrowSquareOut, Folder, MagnifyingGlass, NotePencil, PushPin } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type Post = {
  id: number
  title: string
  excerpt: string
  date: string | null
  readTime: string
  url: string | null
  tags: string[]
  folder: string
  pinned?: boolean
}

const posts: Post[] = [
  {
    id: 0,
    title: "In progress",
    excerpt:
      "Working on more in-depth articles about AI engineering, cloud architecture and backend development.",
    date: null,
    readTime: "Draft",
    url: null,
    tags: ["Drafts"],
    folder: "Drafts",
    pinned: true,
  },
  {
    id: 1,
    title: "Common Pitfalls While Setting Up an AWS Account",
    excerpt: "Common pitfalls to watch for when setting up a new AWS account.",
    date: "2025-07-28",
    readTime: "4 min read",
    url: "https://medium.com/@ashishnagmoti7/common-pitfalls-while-setting-up-an-aws-account-b2767d9dde5b",
    tags: ["AWS", "Cloud"],
    folder: "Cloud",
  },
  {
    id: 3,
    title: "My CS50 experience",
    excerpt: "My experience and learnings from the CS50 course.",
    date: "2024-06-21",
    readTime: "6 min read",
    url: "https://medium.com/long-sweet-valuable/my-cs50-experience-44b5b8826c4d",
    tags: ["CS50", "Learning"],
    folder: "Learning",
  },
  {
    id: 2,
    title: "I switched to Arch Linux",
    excerpt: "My journey from Windows to Arch Linux, and the problems I hit along the way.",
    date: "2024-01-30",
    readTime: "5 min read",
    url: "https://medium.com/@ashishnagmoti7/i-switched-to-arch-linux-cca16df9c2a7",
    tags: ["Linux", "Arch"],
    folder: "Linux",
  },
  {
    id: 4,
    title: "My Hacktoberfest Journey: Navigating Challenges and Embracing Growth",
    excerpt: "Navigating the challenges of Hacktoberfest, and the growth that came with them.",
    date: "2023-11-08",
    readTime: "4 min read",
    url: "https://medium.com/@ashishnagmoti7/my-hacktoberfest-journey-navigating-challenges-and-embracing-growth-14d6faf8649b",
    tags: ["Hacktoberfest", "OpenSource"],
    folder: "Open Source",
  },
]

const ALL = "All Posts"
const FOLDERS = [ALL, "Cloud", "Learning", "Linux", "Open Source", "Drafts"]

// Notes' yellow: darker on white so it stays legible, brighter on dark.
const YELLOW_TEXT = "text-[#c99a00] dark:text-[#ffd60a]"

const longDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
const shortDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })

/**
 * The blog, as Apple Notes: folders on the left, a note list grouped by year
 * (with Pinned on top) in the middle, and the selected note on the right.
 * Selecting a note reads it in place; "Open in Medium" goes to the post.
 */
export function BlogApp() {
  const [folder, setFolder] = useState(ALL)
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(1)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(
      (p) =>
        (folder === ALL || p.folder === folder) &&
        (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)),
    )
  }, [folder, query])

  const groups = useMemo(() => {
    const out: { label: string; items: Post[] }[] = []
    const pinned = visible.filter((p) => p.pinned)
    if (pinned.length) out.push({ label: "Pinned", items: pinned })
    const dated = visible
      .filter((p) => !p.pinned && p.date)
      .sort((a, b) => (a.date! < b.date! ? 1 : -1))
    for (const p of dated) {
      const year = p.date!.slice(0, 4)
      const g = out.find((x) => x.label === year)
      if (g) g.items.push(p)
      else out.push({ label: year, items: [p] })
    }
    return out
  }, [visible])

  const selected = visible.find((p) => p.id === selectedId) ?? visible[0] ?? null
  const count = (f: string) => (f === ALL ? posts.length : posts.filter((p) => p.folder === f).length)

  return (
    <div className="flex h-full text-[13px]">
      {/* Folders */}
      <aside className="hidden w-[176px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-black/[0.08] bg-[#f1f1f2] p-2 dark:border-white/[0.08] dark:bg-[#252527] sm:flex">
        <p className="px-2 pb-1 pt-2 text-[11px] font-semibold text-muted-foreground">iCloud</p>
        {FOLDERS.map((f) => (
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
              {g.items.map((p) => {
                const active = selected?.id === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={cn(
                      "block w-full rounded-lg px-2.5 py-2 text-left transition-colors",
                      active
                        ? "bg-[#ffd60a] text-black dark:bg-[#8a6c00] dark:text-white"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]",
                    )}
                  >
                    <p className="truncate font-semibold">{p.title}</p>
                    <p className={cn("truncate text-[12px]", active ? "text-black/70 dark:text-white/75" : "text-muted-foreground")}>
                      <span className="mr-1.5 tabular-nums">{p.date ? shortDate(p.date) : p.readTime}</span>
                      {p.excerpt}
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
        <div className="flex h-11 shrink-0 items-center justify-end border-b border-black/[0.06] px-4 dark:border-white/[0.06]">
          {selected?.url && (
            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("flex items-center gap-1.5 rounded-md px-2 py-1 font-medium hover:bg-black/[0.05] dark:hover:bg-white/[0.08]", YELLOW_TEXT)}
            >
              Open in Medium
              <ArrowSquareOut className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {selected ? (
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <p className="text-center text-[11px] text-muted-foreground">
              {selected.date ? longDate(selected.date) : "Draft"}
            </p>
            <h1 className="mt-4 text-[22px] font-bold leading-tight tracking-tight">{selected.title}</h1>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/85">{selected.excerpt}</p>
            <p className="mt-4 text-[12px] text-muted-foreground">
              {selected.readTime}
              {selected.url ? " · Published on Medium" : ""}
            </p>
            <p className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-[13px] font-medium">
              {selected.tags.map((t) => (
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
