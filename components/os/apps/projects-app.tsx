"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconBadge } from "@/components/os/icon-badge"
import { NativeSection, NativeRow } from "@/components/os/native-list"
import { ExternalLink, Github, Brain, Globe, Code } from "lucide-react"

const CATEGORY_GRADIENT: Record<string, string> = {
  AI: "from-violet-400 to-fuchsia-600",
  Web: "from-sky-400 to-blue-600",
}

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

export function ProjectsApp() {
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6">
      <motion.div variants={itemVariants}>
        <NativeSection label={`${projects.length} Projects`}>
          {projects.map((project) => (
            <NativeRow
              key={project.id}
              icon={
                <IconBadge
                  icon={project.icon}
                  gradient={CATEGORY_GRADIENT[project.category] ?? "from-violet-400 to-indigo-600"}
                  size="md"
                />
              }
              title={project.title}
              subtitle={
                <>
                  {project.description}
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </>
              }
              trailing={
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge variant="secondary" className="text-xs">
                    {project.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{project.date}</span>
                </div>
              }
              onClick={() => setSelected(project)}
            />
          ))}
        </NativeSection>
      </motion.div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2.5">
                  <IconBadge
                    icon={selected.icon}
                    gradient={CATEGORY_GRADIENT[selected.category] ?? "from-violet-400 to-indigo-600"}
                    size="sm"
                  />
                  {selected.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">{selected.longDescription}</p>
                <div>
                  <h4 className="font-semibold mb-2">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.tech.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild>
                    <a href={selected.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  {selected.demo && selected.demo !== "#" && (
                    <Button variant="outline" asChild>
                      <a href={selected.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
