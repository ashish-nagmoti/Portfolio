"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconBadge } from "@/components/os/icon-badge"
import { cn } from "@/lib/utils"
import { ExternalLink, Github, Brain, Globe, Code, LayoutGrid, List, Search, Folder, Sparkles } from "lucide-react"

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

const FAVORITES = [
  { id: "all", label: "All Projects", icon: Folder },
  { id: "AI", label: "AI", icon: Sparkles },
  { id: "Web", label: "Web", icon: Globe },
] as const

export function ProjectsApp() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null)

  const filtered = projects.filter(
    (p) => (filter === "all" || p.category === filter) && p.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar, Finder style */}
      <div className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.08]">
        <span className="text-sm font-semibold">Projects</span>
        <div className="flex-1" />
        <div className="flex items-center rounded-lg border border-black/[0.08] p-0.5 dark:border-white/[0.1]">
          <button
            onClick={() => setView("grid")}
            className={cn("rounded-md p-1.5 transition-colors", view === "grid" ? "bg-secondary" : "text-muted-foreground hover:bg-secondary/50")}
            aria-label="Icon view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("rounded-md p-1.5 transition-colors", view === "list" ? "bg-secondary" : "text-muted-foreground hover:bg-secondary/50")}
            aria-label="List view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-7 w-36 rounded-md border border-black/[0.08] bg-background pl-8 pr-2 text-xs outline-none focus:ring-1 focus:ring-primary dark:border-white/[0.1]"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[150px] shrink-0 space-y-0.5 overflow-y-auto border-r border-black/[0.06] p-2 dark:border-white/[0.08]">
          <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Favorites</p>
          {FAVORITES.map((fav) => {
            const isActive = filter === fav.id
            return (
              <button
                key={fav.id}
                onClick={() => setFilter(fav.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                )}
              >
                <fav.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {fav.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No projects match &quot;{query}&quot;.</p>
          )}
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filtered.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelected(project)}
                  className="flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  <IconBadge
                    icon={project.icon}
                    gradient={CATEGORY_GRADIENT[project.category] ?? "from-violet-400 to-indigo-600"}
                    size="xl"
                  />
                  <span className="text-xs font-medium leading-tight">{project.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/[0.06] text-left text-xs text-muted-foreground dark:border-white/[0.08]">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="hidden pb-2 font-medium sm:table-cell">Kind</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => setSelected(project)}
                    className="cursor-pointer border-b border-black/[0.04] transition-colors hover:bg-black/[0.02] dark:border-white/[0.06] dark:hover:bg-white/[0.03]"
                  >
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <IconBadge
                          icon={project.icon}
                          gradient={CATEGORY_GRADIENT[project.category] ?? "from-violet-400 to-indigo-600"}
                          size="sm"
                        />
                        {project.title}
                      </div>
                    </td>
                    <td className="hidden py-2 pr-3 text-muted-foreground sm:table-cell">{project.category} Project</td>
                    <td className="py-2 text-muted-foreground whitespace-nowrap">{project.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="shrink-0 border-t border-black/[0.06] px-4 py-1.5 text-xs text-muted-foreground dark:border-white/[0.08]">
        {filtered.length} item{filtered.length !== 1 ? "s" : ""}
      </div>

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
    </div>
  )
}
