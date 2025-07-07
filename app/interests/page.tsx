"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Headphones, Trophy, Coffee, Globe, BookOpen, LinkIcon, Star, Youtube, ExternalLink } from "lucide-react"
import { Calendar } from "lucide-react"

const interestItems = [
  {
    id: 1,
    type: "blog",
    title: "Building Microservices with Python and Docker",
    author: "Real Python",
    url: "https://realpython.com/python-microservices-grpc/",
    description:
      "Comprehensive guide on building scalable microservices architecture using Python, gRPC, and Docker containers.",
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
    description:
      "Analysis of current AI trends, LLM developments, and predictions for the future of artificial intelligence.",
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
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "video":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "article":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

export default function Interests() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredItems =
    selectedCategory === "All" ? interestItems : interestItems.filter((item) => item.type === selectedCategory)

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-20">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Interests & Hobbies</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Beyond coding and cloud architecture, here's what keeps me motivated and inspired.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="mb-2 capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Interests Grid */}
          <div className="space-y-16">
            {filteredItems.map((item) => {
              const Icon = getIcon(item.type)
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                            <Icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="group-hover:text-primary transition-colors text-lg leading-tight">
                              {item.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>

                      <div className="flex items-center justify-between">
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
                            {new Date(item.dateAdded).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
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

          {/* Fun Facts Section */}
          <motion.div
            variants={itemVariants}
            className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Fun Facts About Me</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Coffee,
                  title: "Coffee Enthusiast",
                  description: "Can't start coding without a perfect cup of coffee",
                },
                {
                  icon: Headphones,
                  title: "Music While Coding",
                  description: "Electronic and lo-fi beats fuel my productivity",
                },
                {
                  icon: Globe,
                  title: "Remote Work Advocate",
                  description: "Believe in the power of distributed teams",
                },
                {
                  icon: Trophy,
                  title: "Hackathon Winner",
                  description: "Won multiple hackathons and coding competitions",
                },
              ].map((fact, index) => (
                <motion.div
                  key={fact.title}
                  className="text-center space-y-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <fact.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">{fact.title}</h4>
                  <p className="text-sm text-muted-foreground">{fact.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quote Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center p-8 border-l-4 border-primary bg-muted/30 rounded-r-lg"
          >
            <blockquote className="text-lg italic text-muted-foreground mb-4">
              "The best way to predict the future is to create it. Whether it's through code, community, or personal
              growth, I believe in continuous learning and making a positive impact."
            </blockquote>
            <cite className="text-sm font-semibold">— My Personal Philosophy</cite>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
