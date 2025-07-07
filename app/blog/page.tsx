"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "Building Scalable APIs with FastAPI and AWS",
    excerpt:
      "Learn how to create high-performance APIs using FastAPI and deploy them on AWS with proper monitoring and scaling strategies.",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["FastAPI", "AWS", "Python", "API Design"],
    slug: "scalable-apis-fastapi-aws",
  },
  {
    id: 2,
    title: "AI-Powered Code Testing: The Future of QA",
    excerpt:
      "Exploring how AI can revolutionize software testing by automatically generating test cases and identifying edge cases.",
    date: "2024-01-08",
    readTime: "6 min read",
    tags: ["AI", "Testing", "Automation", "QA"],
    slug: "ai-powered-code-testing",
  },
  {
    id: 3,
    title: "Cost Optimization with AWS Spot Instances",
    excerpt:
      "A comprehensive guide to reducing AWS costs by up to 70% using spot instances with proper orchestration and failover strategies.",
    date: "2024-01-01",
    readTime: "10 min read",
    tags: ["AWS", "Cost Optimization", "Cloud", "DevOps"],
    slug: "aws-spot-instances-optimization",
  },
  {
    id: 4,
    title: "Integrating LLMs into Production Systems",
    excerpt:
      "Best practices for integrating Large Language Models into production applications with proper error handling and monitoring.",
    date: "2023-12-20",
    readTime: "12 min read",
    tags: ["LLM", "AI", "Production", "Integration"],
    slug: "llm-production-integration",
  },
  {
    id: 5,
    title: "Django vs FastAPI: Choosing the Right Framework",
    excerpt:
      "A detailed comparison of Django and FastAPI for different use cases, performance benchmarks, and development experience.",
    date: "2023-12-10",
    readTime: "7 min read",
    tags: ["Django", "FastAPI", "Python", "Comparison"],
    slug: "django-vs-fastapi-comparison",
  },
]

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

export default function Blog() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-20">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground">
              Thoughts on AI, backend development, and cloud architecture.
            </p>
          </motion.div>

          {/* Blog Posts */}
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
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
                      <Button variant="ghost" size="sm" className="group/btn">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16 p-8 border-2 border-dashed border-muted rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-2">More Posts Coming Soon</h3>
            <p className="text-muted-foreground">
              I'm working on more in-depth articles about AI engineering, cloud architecture, and backend development.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
