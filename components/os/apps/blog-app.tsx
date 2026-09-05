"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { IconBadge } from "@/components/os/icon-badge"
import { NativeSection, NativeRow } from "@/components/os/native-list"
import { Newspaper } from "lucide-react"

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
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function BlogApp() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      <motion.div variants={itemVariants}>
        <NativeSection label={`${blogPosts.length} Posts`}>
          {blogPosts.map((post) => (
            <NativeRow
              key={post.id}
              icon={<IconBadge icon={Newspaper} gradient="from-orange-400 to-amber-600" size="md" />}
              title={post.title}
              subtitle={
                <>
                  {post.excerpt}
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              }
              trailing={
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
                  <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>{post.readTime}</span>
                </div>
              }
              href={post.url}
            />
          ))}
        </NativeSection>
      </motion.div>

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
