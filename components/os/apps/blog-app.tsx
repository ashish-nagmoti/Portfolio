"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"

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
      {blogPosts.map((post) => (
        <motion.div key={post.id} variants={itemVariants} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="group cursor-pointer hover:-translate-y-1 hover:shadow-clay-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors text-lg">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="group/btn" asChild>
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <motion.div variants={itemVariants} className="text-center p-8 rounded-3xl bg-card shadow-clay-inset">
        <h3 className="text-lg font-semibold mb-2">More Posts Coming Soon</h3>
        <p className="text-muted-foreground text-sm">
          I'm working on more in-depth articles about AI engineering, cloud architecture, and backend development.
        </p>
      </motion.div>
    </motion.div>
  )
}
