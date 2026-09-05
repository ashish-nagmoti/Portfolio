"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconBadge } from "@/components/os/icon-badge"
import { Headphones, Trophy, Coffee, Globe, BookOpen, LinkIcon, Star, Youtube, ExternalLink, Calendar } from "lucide-react"

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

      <div className="space-y-6">
        {filteredItems.map((item) => {
          const Icon = getIcon(item.type)
          return (
            <motion.div key={item.id} variants={itemVariants} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="group cursor-pointer hover:-translate-y-1 hover:shadow-clay-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <IconBadge icon={Icon} gradient={getTypeGradient(item.type)} size="md" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="group-hover:text-primary transition-colors text-base leading-tight">
                          {item.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-[52px] sm:pl-0 sm:flex-shrink-0">
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < item.rating ? "text-yellow-400 fill-current" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{item.description}</p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.dateAdded).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Read
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-gradient-to-br from-clay-sky/15 via-primary/10 to-clay-pink/15 shadow-clay">
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

      <motion.div variants={itemVariants} className="text-center p-8 rounded-3xl bg-card shadow-clay-inset">
        <blockquote className="text-base italic text-muted-foreground mb-4">
          "The best way to predict the future is to create it. Whether it's through code, community, or personal
          growth, I believe in continuous learning and making a positive impact."
        </blockquote>
        <cite className="text-sm font-semibold">— My Personal Philosophy</cite>
      </motion.div>
    </motion.div>
  )
}
