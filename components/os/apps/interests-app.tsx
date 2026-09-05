"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Headphones,
  Trophy,
  Coffee,
  Globe,
  BookOpen,
  LinkIcon,
  Youtube,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Heart,
  ExternalLink,
  Volume2,
  type LucideIcon,
} from "lucide-react"

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

export function InterestsApp() {
  const [filter, setFilter] = useState<string>("All")
  const [nowPlayingId, setNowPlayingId] = useState<number>(interestItems[0].id)
  const [isPlaying, setIsPlaying] = useState(false)

  const filteredItems = filter === "All" ? interestItems : interestItems.filter((item) => item.type === filter)
  const nowPlaying = interestItems.find((i) => i.id === nowPlayingId) ?? interestItems[0]

  const playItem = (id: number) => {
    if (id === nowPlayingId) setIsPlaying((p) => !p)
    else {
      setNowPlayingId(id)
      setIsPlaying(true)
    }
  }

  const skip = (dir: 1 | -1) => {
    const list = filteredItems.length ? filteredItems : interestItems
    const idx = list.findIndex((i) => i.id === nowPlayingId)
    const next = list[(idx + dir + list.length) % list.length] ?? list[0]
    setNowPlayingId(next.id)
    setIsPlaying(true)
  }

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
          <button
            onClick={() => playItem((filteredItems[0] ?? interestItems[0]).id)}
            aria-label="Play"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1DB954] shadow-lg transition-transform hover:scale-105"
          >
            {isPlaying && nowPlayingId === (filteredItems[0] ?? interestItems[0]).id ? (
              <Pause className="h-6 w-6 fill-black text-black" />
            ) : (
              <Play className="ml-0.5 h-6 w-6 fill-black text-black" />
            )}
          </button>
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
                const active = item.id === nowPlayingId
                return (
                  <tr key={item.id} className="group rounded transition-colors hover:bg-white/10">
                    <td className="w-10 py-2 pl-3 align-middle">
                      <button onClick={() => playItem(item.id)} aria-label="Play" className="relative flex h-5 w-5 items-center justify-center">
                        <span className={cn("text-sm group-hover:hidden", active ? "text-[#1DB954]" : "text-[#a7a7a7]")}>{i + 1}</span>
                        {active && isPlaying ? (
                          <Pause className="hidden h-3.5 w-3.5 fill-white text-white group-hover:block" />
                        ) : (
                          <Play className="hidden h-3.5 w-3.5 fill-white text-white group-hover:block" />
                        )}
                      </button>
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
                          <p className={cn("truncate font-medium hover:underline", active ? "text-[#1DB954]" : "text-white")}>
                            {item.title}
                          </p>
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

      {/* Now Playing bar, Spotify style */}
      <div className="flex h-[72px] shrink-0 items-center gap-4 border-t border-white/10 bg-[#181818] px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none sm:w-1/3">
          <Cover type={nowPlaying.type} className="h-12 w-12" iconClassName="h-5 w-5" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{nowPlaying.title}</p>
            <p className="truncate text-xs text-[#a7a7a7]">{nowPlaying.author}</p>
          </div>
          <Heart className="ml-2 hidden h-4 w-4 shrink-0 fill-[#1DB954] text-[#1DB954] sm:block" />
        </div>

        <div className="hidden flex-1 flex-col items-center gap-1.5 sm:flex">
          <div className="flex items-center gap-5">
            <Shuffle className="h-4 w-4 text-[#a7a7a7] hover:text-white" />
            <button onClick={() => skip(-1)} aria-label="Previous">
              <SkipBack className="h-4 w-4 fill-white text-white" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform hover:scale-105"
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-black text-black" /> : <Play className="ml-0.5 h-4 w-4 fill-black text-black" />}
            </button>
            <button onClick={() => skip(1)} aria-label="Next">
              <SkipForward className="h-4 w-4 fill-white text-white" />
            </button>
            <a href={nowPlaying.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${nowPlaying.title}`}>
              <ExternalLink className="h-4 w-4 text-[#a7a7a7] hover:text-white" />
            </a>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <span className="text-[10px] text-[#a7a7a7]">{isPlaying ? "0:42" : "0:00"}</span>
            <div className="h-1 flex-1 rounded-full bg-white/20">
              <div className={cn("h-1 rounded-full bg-white", isPlaying ? "w-1/3" : "w-0")} />
            </div>
            <span className="text-[10px] text-[#a7a7a7]">2:14</span>
          </div>
        </div>

        <div className="hidden w-1/3 items-center justify-end gap-2 sm:flex">
          <Volume2 className="h-4 w-4 text-[#a7a7a7]" />
          <div className="h-1 w-20 rounded-full bg-white/20">
            <div className="h-1 w-2/3 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
