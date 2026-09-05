"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const blogPosts = [
  {
    id: 1,
    title: "Common Pitfalls While Setting Up an AWS Account",
    excerpt: "Common Pitfalls While Setting Up an AWS Account",
    date: "2025-07-28",
    readTime: "4 min read",
    url: "https://medium.com/@ashishnagmoti7/common-pitfalls-while-setting-up-an-aws-account-b2767d9dde5b",
    tags: ["AWS", "Cloud", "Mistakes"],
  },
  {
    id: 2,
    title: "I switched to Arch Linux",
    excerpt: "Here I showcase my journey from Windows to Arch Linux and the problems I had in journey.",
    date: "2024-01-30",
    readTime: "5 min read",
    url: "https://medium.com/@ashishnagmoti7/i-switched-to-arch-linux-cca16df9c2a7",
    tags: ["Linux", "Journey", "Arch"],
  },
  {
    id: 3,
    title: "My CS50 experience",
    excerpt: "My experience and learnings from the CS50 course.",
    date: "2024-06-21",
    readTime: "6 min read",
    url: "https://medium.com/long-sweet-valuable/my-cs50-experience-44b5b8826c4d",
    tags: ["CS50", "Learning", "Programming"],
  },
  {
    id: 4,
    title: "My Hacktoberfest Journey: Navigating Challenges and Embracing Growth",
    excerpt: "My Hacktoberfest Journey: Navigating Challenges and Embracing Growth.",
    date: "2023-11-08",
    readTime: "4 min read",
    url: "https://medium.com/@ashishnagmoti7/my-hacktoberfest-journey-navigating-challenges-and-embracing-growth-14d6faf8649b",
    tags: ["Hacktoberfest", "Open Source", "Growth"],
  },
]

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

// Mirrors the real Calendar.app icon: a red month header over a white day
// number — used here as the "event date" marker in Calendar's list view.
function DateChip({ dateStr }: { dateStr: string }) {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="w-12 overflow-hidden rounded-lg border border-black/[0.08] shadow-sm dark:border-white/[0.1]">
        <div className="bg-red-500 py-0.5 text-center text-[9px] font-bold tracking-wide text-white">{month}</div>
        <div className="flex h-8 items-center justify-center bg-white text-lg font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-white">
          {day}
        </div>
      </div>
      <span className="mt-1 text-[10px] text-muted-foreground">{weekday}</span>
    </div>
  )
}

function groupByMonth(posts: typeof blogPosts) {
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const groups: { label: string; posts: typeof blogPosts }[] = []
  for (const post of sorted) {
    const label = new Date(post.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    const group = groups.find((g) => g.label === label)
    if (group) group.posts.push(post)
    else groups.push({ label, posts: [post] })
  }
  return groups
}

export function BlogApp() {
  const groups = groupByMonth(blogPosts)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-7">
      {groups.map((group) => (
        <motion.div key={group.label} variants={itemVariants}>
          <h3 className="mb-3 px-1 text-sm font-semibold text-muted-foreground">{group.label}</h3>
          <div className="space-y-2">
            {group.posts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl border border-black/[0.06] bg-card p-3 transition-colors hover:bg-black/[0.02] dark:border-white/[0.08] dark:hover:bg-white/[0.03]"
              >
                <DateChip dateStr={post.date} />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="font-medium leading-tight">{post.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 pt-0.5 text-xs text-muted-foreground">{post.readTime}</span>
              </a>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-black/[0.06] bg-card p-8 text-center dark:border-white/[0.08]"
      >
        <h3 className="text-lg font-semibold mb-2">More Posts Coming Soon</h3>
        <p className="text-muted-foreground text-sm">
          I&apos;m working on more in-depth articles about AI engineering, cloud architecture, and backend development.
        </p>
      </motion.div>
    </motion.div>
  )
}
