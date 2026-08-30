"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExternalLink, Github, Code, Brain, Globe } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "StoryMail – AI-Powered Smart Email Platform",
    description: "AI platform for email classification, weekly digests, and querying.",
    longDescription:
      "StoryMail is an AI-powered platform that classifies emails, generates weekly digests, and allows users to query their inbox using natural language. Built with Django, Auth0, Postgres SQL, and GeminiAPI for robust authentication and advanced AI features.",
    tech: ["Django", "Auth0", "Postgres SQL", "GeminiAPI"],
    category: "AI",
    icon: Brain,
    github: "https://github.com/ashish-nagmoti/storymail",
    demo: "http://story-mail-olive.vercel.app/",
    date: "Mar 2024 – Oct 2024",
  },
  {
    id: 2,
    title: "KalaShala – Platform Empowering Local Artists",
    description: "Platform for local artists to showcase, publish content, and grow.",
    longDescription:
      "KalaShala is a platform designed for local artists to showcase their work, publish content, and grow their audience. Role: Backend Development and Deployment.",
    tech: ["Django", "AWS", "Postgres SQL"],
    category: "Web",
    icon: Globe,
    github: "https://github.com/ashish-nagmoti/kalashala-backend",
    demo: "https://kalashala-frontend1-zxra.vercel.app/",
    date: "Feb 2024 – Mar 2024",
  },
  {
    id: 3,
    title: "AceUp – Student Resource Hub with AI Chatbot",
    description: "Student hub with notes, roadmaps, events, and chatbot.",
    longDescription:
      "AceUp is a student resource hub featuring notes, roadmaps, events, and an integrated AI chatbot. Built using Django, Tailwind CSS, Jinja, SQLite3, and Python.",
    tech: ["Django", "Tailwind CSS", "Jinja", "SQLite3", "Python"],
    category: "AI",
    icon: Code,
    github: "https://github.com/riaan-attar/AceUp",
    demo: "https://inevitable-lucky-predeator-b19e8de5.koyeb.app/",
    date: "2024",
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

export function ProjectsContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6">
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <motion.div key={project.id} variants={itemVariants} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="h-full group cursor-pointer relative hover:shadow-clay-lg transition-all duration-300">
              <div className="absolute top-4 right-4 z-10">
                <Badge variant="secondary" className="text-xs">{project.category}</Badge>
              </div>
              <div className="flex flex-col items-center justify-center py-8 gap-3 px-5">
                <div className="rounded-full bg-primary/10 p-4 mb-1 shadow-clay-sm">
                  <project.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-base font-bold text-center leading-tight">{project.title}</h2>
                <p className="text-xs text-muted-foreground font-semibold tracking-wide">{project.date}</p>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 justify-center mt-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Code className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <project.icon className="h-5 w-5" />
                          {project.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{project.longDescription}</p>
                        <div>
                          <h4 className="font-semibold mb-2">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech) => (
                              <Badge key={tech} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-2" />
                              GitHub
                            </a>
                          </Button>
                          {project.demo && project.demo !== "#" && (
                            <Button variant="outline" asChild>
                              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
