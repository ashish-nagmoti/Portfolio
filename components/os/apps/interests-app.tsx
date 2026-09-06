"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Headphones, Trophy, Coffee, Globe, BookOpen, LinkIcon, Youtube, Play, Shuffle, Heart, type LucideIcon } from "lucide-react"

const interestItems = [
  {
    id: 1,
    type: "blog",
    title: "Building Microservices with Python and Docker",
    author: "Real Python",
    url: "https://realpython.com/python-microservices-grpc/",
    dateAdded: "2024-01-15",
  },
  {
    id: 2,
    type: "video",
    title: "AWS re:Invent 2023 - Serverless at Scale",
    author: "AWS Events",
    url: "https://youtube.com/watch?v=example",
    dateAdded: "2024-01-12",
  },
  {
    id: 3,
    type: "blog",
    title: "The State of AI in 2024: LLMs and Beyond",
    author: "Towards Data Science",
    url: "https://towardsdatascience.com/ai-2024-trends",
    dateAdded: "2024-01-10",
  },
  {
    id: 4,
    type: "video",
    title: "System Design Interview: Design a Chat System",
    author: "Tech Dummies",
    url: "https://youtube.com/watch?v=example2",
    dateAdded: "2024-01-08",
  },
  {
    id: 5,
    type: "article",
    title: "FastAPI vs Django: Performance Comparison 2024",
    author: "Python Weekly",
    url: "https://pythonweekly.com/fastapi-django-comparison",
    dateAdded: "2024-01-05",
  },
  {
    id: 6,
    type: "video",
    title: "Building Production-Ready APIs with Python",
    author: "ArjanCodes",
    url: "https://youtube.com/watch?v=example3",
    dateAdded: "2024-01-03",
  },
  {
    id: 7,
    type: "blog",
    title: "Understanding Kubernetes Networking",
    author: "CNCF Blog",
    url: "https://cncf.io/blog/kubernetes-networking",
    dateAdded: "2024-01-01",
  },
  {
    id: 8,
    type: "article",
    title: "The Psychology of Code Reviews",
    author: "Stack Overflow Blog",
    url: "https://stackoverflow.blog/code-review-psychology",
    dateAdded: "2023-12-28",
  },
]

const FILTERS = ["All", "blog", "video", "article"] as const

const getIcon = (type: string): LucideIcon => {
  switch (type) {
    case "blog":
      return BookOpen
    case "video":
      return Youtube
    case "article":
      return LinkIcon
    default:
      return LinkIcon
  }
}

const getTypeGradient = (type: string) => {
  switch (type) {
    case "blog":
      return "from-sky-400 to-blue-600"
    case "video":
      return "from-rose-400 to-rose-600"
    case "article":
      return "from-emerald-400 to-green-600"
    default:
      return "from-zinc-500 to-zinc-700"
  }
}

function Cover({ type, className, iconClassName }: { type: string; className?: string; iconClassName?: string }) {
  const Icon = getIcon(type)
  return (
    <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded bg-gradient-to-br shadow-md", getTypeGradient(type), className)}>
      <Icon className={cn("text-white/90", iconClassName)} />
    </div>
  )
}

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const TYPE_META = [
  { type: "blog", label: "Blogs", dot: "bg-sky-400", bar: "bg-sky-400" },
  { type: "video", label: "Videos", dot: "bg-rose-400", bar: "bg-rose-400" },
  { type: "article", label: "Articles", dot: "bg-emerald-400", bar: "bg-emerald-400" },
] as const

export function InterestsApp() {
  const [filter, setFilter] = useState<string>("All")

  const filteredItems = filter === "All" ? interestItems : interestItems.filter((item) => item.type === filter)
  const typeCounts = TYPE_META.map((t) => ({ ...t, count: interestItems.filter((i) => i.type === t.type).length }))

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#121212] text-white">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Hero, "Liked Songs" style */}
        <div className="bg-gradient-to-b from-indigo-700 via-indigo-800/60 to-[#121212] px-6 pb-6 pt-10">
          <div className="flex items-end gap-5">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded bg-gradient-to-br from-indigo-400 to-purple-800 shadow-2xl sm:h-32 sm:w-32">
              <Heart className="h-12 w-12 fill-white text-white sm:h-14 sm:w-14" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold">Playlist</p>
              <h1 className="mt-1 truncate text-3xl font-black tracking-tight sm:text-5xl">Liked Interests</h1>
              <p className="mt-3 text-sm text-white/70">Ashish Nagmoti &middot; {interestItems.length} saved</p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-6 bg-gradient-to-b from-black/20 to-[#121212] px-6 py-4">
          <a
            href={(filteredItems[0] ?? interestItems[0]).url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open top saved item"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1DB954] shadow-lg transition-transform hover:scale-105"
          >
            <Play className="ml-0.5 h-6 w-6 fill-black text-black" />
          </a>
          <Shuffle className="h-5 w-5 text-[#1DB954]" />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 px-6 pb-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors",
                filter === f ? "bg-white text-black" : "bg-[#232323] text-white hover:bg-[#2a2a2a]",
              )}
            >
              {f === "All" ? "All" : `${f}s`}
            </button>
          ))}
        </div>

        {/* Track list */}
        <div className="px-2 pb-6 sm:px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-[#a7a7a7]">
                <th className="w-10 py-2 pl-3 font-normal">#</th>
                <th className="py-2 pr-3 font-normal">Title</th>
                <th className="hidden py-2 pr-3 font-normal sm:table-cell">Date added</th>
                <th className="w-10 py-2 pr-3 font-normal">
                  <Heart className="ml-auto h-4 w-4" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, i) => {
                return (
                  <tr key={item.id} className="group rounded transition-colors hover:bg-white/10">
                    <td className="w-10 py-2 pl-3 align-middle">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${item.title}`}
                        className="relative flex h-5 w-5 items-center justify-center"
                      >
                        <span className="text-sm text-[#a7a7a7] group-hover:hidden">{i + 1}</span>
                        <Play className="hidden h-3.5 w-3.5 fill-white text-white group-hover:block" />
                      </a>
                    </td>
                    <td className="py-2 pr-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-0 items-center gap-3 text-left"
                      >
                        <Cover type={item.type} className="h-10 w-10" iconClassName="h-4 w-4" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white hover:underline">{item.title}</p>
                          <p className="truncate text-xs text-[#a7a7a7]">{item.author}</p>
                        </div>
                      </a>
                    </td>
                    <td className="hidden whitespace-nowrap py-2 pr-3 text-xs text-[#a7a7a7] sm:table-cell">{fmtDate(item.dateAdded)}</td>
                    <td className="w-10 py-2 pr-3">
                      <Heart className="ml-auto h-4 w-4 fill-[#1DB954] text-[#1DB954]" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && <p className="p-6 text-center text-sm text-[#a7a7a7]">Nothing saved here yet.</p>}
        </div>

        {/* Fun facts */}
        <div className="mx-2 mb-4 rounded-lg bg-[#181818] p-6 sm:mx-6 sm:p-8">
          <h3 className="mb-6 text-center text-xl font-bold">Fun Facts About Me</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              { icon: Coffee, title: "Coffee Enthusiast", description: "Can't start coding without a perfect cup of coffee" },
              { icon: Headphones, title: "Music While Coding", description: "Electronic and lo-fi beats fuel my productivity" },
              { icon: Globe, title: "Remote Work Advocate", description: "Believe in the power of distributed teams" },
              { icon: Trophy, title: "Hackathon Winner", description: "Won multiple hackathons and coding competitions" },
            ].map((fact) => (
              <div key={fact.title} className="space-y-2 text-center">
                <fact.icon className="mx-auto h-7 w-7 text-[#1DB954]" />
                <h4 className="text-sm font-semibold">{fact.title}</h4>
                <p className="text-xs text-[#a7a7a7]">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-2 mb-6 rounded-lg bg-[#181818] p-6 text-center sm:mx-6 sm:p-8">
          <blockquote className="mb-3 text-sm italic text-[#d1d1d1]">
            &quot;The best way to predict the future is to create it. Whether it&apos;s through code, community, or
            personal growth, I believe in continuous learning and making a positive impact.&quot;
          </blockquote>
          <cite className="text-xs font-semibold text-[#a7a7a7]">— My Personal Philosophy</cite>
        </div>
      </div>

      {/* Interests at a glance, mini stats footer */}
      <div className="flex h-[72px] shrink-0 items-center gap-4 border-t border-white/10 bg-[#181818] px-4 sm:px-6">
        <div className="shrink-0">
          <p className="text-sm font-semibold leading-tight">{interestItems.length} saved</p>
          <p className="text-xs text-[#a7a7a7]">at a glance</p>
        </div>

        <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          {typeCounts.map((t) => (
            <div
              key={t.type}
              className={cn("h-full", t.bar)}
              style={{ width: `${(t.count / interestItems.length) * 100}%` }}
            />
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          {typeCounts.map((t) => (
            <div key={t.type} className="flex items-center gap-1.5 text-xs text-[#a7a7a7]">
              <span className={cn("h-2 w-2 rounded-full", t.dot)} />
              {t.label} ({t.count})
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
