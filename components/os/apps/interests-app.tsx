"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconBadge } from "@/components/os/icon-badge"
import { NativeSection, NativeRow } from "@/components/os/native-list"
import { Headphones, Trophy, Coffee, Globe, BookOpen, LinkIcon, Star, Youtube } from "lucide-react"

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

const categories = ["All", "blog", "video", "article"]

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

const getTypeColor = (type: string) => {
  switch (type) {
    case "blog":
      return "bg-sky-500/15 text-sky-600 dark:text-sky-300"
    case "video":
      return "bg-rose-500/15 text-rose-600 dark:text-rose-300"
    case "article":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
    default:
      return "bg-secondary text-secondary-foreground"
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
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function InterestsApp() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredItems =
    selectedCategory === "All" ? interestItems : interestItems.filter((item) => item.type === selectedCategory)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-8">
      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NativeSection label={`${filteredItems.length} Saved`}>
          {filteredItems.map((item) => {
            const Icon = getIcon(item.type)
            return (
              <NativeRow
                key={item.id}
                icon={<IconBadge icon={Icon} gradient={getTypeGradient(item.type)} size="md" />}
                title={item.title}
                subtitle={
                  <>
                    by {item.author}
                    <p className="mt-1">{item.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                }
                trailing={
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < item.rating ? "text-yellow-400 fill-current" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.dateAdded).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                }
                href={item.url}
              />
            )
          })}
        </NativeSection>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-black/[0.06] bg-gradient-to-br from-clay-sky/10 via-primary/5 to-clay-pink/10 p-8 dark:border-white/[0.08]"
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
        className="text-center rounded-2xl border border-black/[0.06] bg-card p-8 dark:border-white/[0.08]"
      >
        <blockquote className="text-base italic text-muted-foreground mb-4">
          &quot;The best way to predict the future is to create it. Whether it&apos;s through code, community, or
          personal growth, I believe in continuous learning and making a positive impact.&quot;
        </blockquote>
        <cite className="text-sm font-semibold">— My Personal Philosophy</cite>
      </motion.div>
    </motion.div>
  )
}
