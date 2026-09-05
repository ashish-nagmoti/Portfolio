"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IconBadge } from "@/components/os/icon-badge"
import { cn } from "@/lib/utils"
import { Headphones, Trophy, Coffee, Globe, BookOpen, LinkIcon, Star, Youtube, Play } from "lucide-react"

const interestItems = [
  {
    id: 1,
    type: "blog",
    title: "Building Microservices with Python and Docker",
    author: "Real Python",
    url: "https://realpython.com/python-microservices-grpc/",
    description: "Comprehensive guide on building scalable microservices architecture using Python, gRPC, and Docker containers.",
    dateAdded: "2024-01-15",
    tags: ["Python", "Microservices", "Docker", "gRPC"],
    rating: 5,
  },
  {
    id: 2,
    type: "video",
    title: "AWS re:Invent 2023 - Serverless at Scale",
    author: "AWS Events",
    url: "https://youtube.com/watch?v=example",
    description: "Deep dive into serverless architecture patterns and how to scale serverless applications on AWS.",
    dateAdded: "2024-01-12",
    tags: ["AWS", "Serverless", "Lambda", "Architecture"],
    rating: 4,
  },
  {
    id: 3,
    type: "blog",
    title: "The State of AI in 2024: LLMs and Beyond",
    author: "Towards Data Science",
    url: "https://towardsdatascience.com/ai-2024-trends",
    description: "Analysis of current AI trends, LLM developments, and predictions for the future of artificial intelligence.",
    dateAdded: "2024-01-10",
    tags: ["AI", "LLM", "Machine Learning", "Trends"],
    rating: 5,
  },
  {
    id: 4,
    type: "video",
    title: "System Design Interview: Design a Chat System",
    author: "Tech Dummies",
    url: "https://youtube.com/watch?v=example2",
    description: "Step-by-step walkthrough of designing a scalable chat system for system design interviews.",
    dateAdded: "2024-01-08",
    tags: ["System Design", "Interview", "Scalability", "Architecture"],
    rating: 4,
  },
  {
    id: 5,
    type: "article",
    title: "FastAPI vs Django: Performance Comparison 2024",
    author: "Python Weekly",
    url: "https://pythonweekly.com/fastapi-django-comparison",
    description: "Detailed performance benchmarks and use case analysis comparing FastAPI and Django frameworks.",
    dateAdded: "2024-01-05",
    tags: ["FastAPI", "Django", "Performance", "Python"],
    rating: 4,
  },
  {
    id: 6,
    type: "video",
    title: "Building Production-Ready APIs with Python",
    author: "ArjanCodes",
    url: "https://youtube.com/watch?v=example3",
    description: "Best practices for building robust, scalable APIs in Python with proper error handling and testing.",
    dateAdded: "2024-01-03",
    tags: ["Python", "API", "Best Practices", "Production"],
    rating: 5,
  },
  {
    id: 7,
    type: "blog",
    title: "Understanding Kubernetes Networking",
    author: "CNCF Blog",
    url: "https://cncf.io/blog/kubernetes-networking",
    description: "Deep dive into Kubernetes networking concepts, CNI plugins, and service mesh architecture.",
    dateAdded: "2024-01-01",
    tags: ["Kubernetes", "Networking", "DevOps", "Cloud Native"],
    rating: 4,
  },
  {
    id: 8,
    type: "article",
    title: "The Psychology of Code Reviews",
    author: "Stack Overflow Blog",
    url: "https://stackoverflow.blog/code-review-psychology",
    description: "How to give and receive constructive feedback in code reviews while maintaining team morale.",
    dateAdded: "2023-12-28",
    tags: ["Code Review", "Team", "Psychology", "Development"],
    rating: 3,
  },
]

const LIBRARY = [
  { id: "All", label: "All Saved", dot: "bg-foreground/60" },
  { id: "blog", label: "Blogs", dot: "bg-sky-500" },
  { id: "video", label: "Videos", dot: "bg-rose-500" },
  { id: "article", label: "Articles", dot: "bg-emerald-500" },
] as const

const getIcon = (type: string) => {
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const featured = interestItems.reduce((best, item) => (item.rating > best.rating ? item : best), interestItems[0])

export function InterestsApp() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredItems =
    selectedCategory === "All" ? interestItems : interestItems.filter((item) => item.type === selectedCategory)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar, Music.app Library style */}
        <div className="w-[160px] min-h-0 shrink-0 space-y-0.5 overflow-y-auto border-r border-black/[0.06] p-2 dark:border-white/[0.08]">
          <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Library</p>
          {LIBRARY.map((lib) => {
            const isActive = selectedCategory === lib.id
            return (
              <button
                key={lib.id}
                onClick={() => setSelectedCategory(lib.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                )}
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", isActive ? "bg-primary-foreground" : lib.dot)} />
                {lib.label}
              </button>
            )
          })}
        </div>

        {/* Song list */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="min-h-0 flex-1 overflow-y-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] text-left text-xs text-muted-foreground dark:border-white/[0.08]">
                <th className="pb-2 font-medium">Title</th>
                <th className="hidden pb-2 font-medium sm:table-cell">Type</th>
                <th className="pb-2 font-medium">Rating</th>
                <th className="hidden pb-2 font-medium md:table-cell">Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const Icon = getIcon(item.type)
                return (
                  <tr
                    key={item.id}
                    onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                    className="group cursor-pointer border-b border-black/[0.04] transition-colors hover:bg-black/[0.02] dark:border-white/[0.06] dark:hover:bg-white/[0.03]"
                  >
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-3">
                        <IconBadge icon={Icon} gradient={getTypeGradient(item.type)} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{item.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-2.5 pr-3 capitalize text-muted-foreground sm:table-cell">{item.type}</td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn("h-3 w-3", i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/25")}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="hidden whitespace-nowrap py-2.5 text-muted-foreground md:table-cell">
                      {new Date(item.dateAdded).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredItems.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">Nothing saved here yet.</p>}

          <motion.div
            variants={itemVariants}
            className="mt-8 rounded-2xl border border-black/[0.06] bg-gradient-to-br from-clay-sky/10 via-primary/5 to-clay-pink/10 p-8 dark:border-white/[0.08]"
          >
            <h3 className="text-xl font-bold mb-6 text-center">Fun Facts About Me</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Coffee, title: "Coffee Enthusiast", description: "Can't start coding without a perfect cup of coffee", gradient: "from-orange-400 to-amber-600" },
                { icon: Headphones, title: "Music While Coding", description: "Electronic and lo-fi beats fuel my productivity", gradient: "from-fuchsia-400 to-pink-600" },
                { icon: Globe, title: "Remote Work Advocate", description: "Believe in the power of distributed teams", gradient: "from-sky-400 to-blue-600" },
                { icon: Trophy, title: "Hackathon Winner", description: "Won multiple hackathons and coding competitions", gradient: "from-yellow-400 to-amber-600" },
              ].map((fact) => (
                <motion.div key={fact.title} className="text-center space-y-3" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                  <IconBadge icon={fact.icon} gradient={fact.gradient} size="lg" className="mx-auto" />
                  <h4 className="font-semibold text-sm">{fact.title}</h4>
                  <p className="text-xs text-muted-foreground">{fact.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 text-center rounded-2xl border border-black/[0.06] bg-card p-8 dark:border-white/[0.08]"
          >
            <blockquote className="text-base italic text-muted-foreground mb-4">
              &quot;The best way to predict the future is to create it. Whether it&apos;s through code, community, or
              personal growth, I believe in continuous learning and making a positive impact.&quot;
            </blockquote>
            <cite className="text-sm font-semibold">— My Personal Philosophy</cite>
          </motion.div>
        </motion.div>
      </div>

      {/* Now Playing bar, Music.app style */}
      <div className="flex shrink-0 items-center gap-3 border-t border-black/[0.06] px-4 py-2.5 dark:border-white/[0.08]">
        <IconBadge icon={getIcon(featured.type)} gradient={getTypeGradient(featured.type)} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{featured.title}</p>
          <p className="truncate text-xs text-muted-foreground">{featured.author}</p>
        </div>
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${featured.title}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
        >
          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
        </a>
      </div>
    </div>
  )
}
