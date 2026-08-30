import type { ComponentType } from "react"
import { User, FolderGit2, TerminalSquare, Mail, Newspaper, Sparkles, FileText, type LucideIcon } from "lucide-react"
import type { AppId } from "./types"
import { AboutApp } from "./apps/about-app"
import { ProjectsApp } from "./apps/projects-app"
import { BlogApp } from "./apps/blog-app"
import { InterestsApp } from "./apps/interests-app"
import { ContactApp } from "./apps/contact-app"
import { TerminalApp } from "./apps/terminal-app"

export interface AppDef {
  id: AppId
  title: string
  icon: LucideIcon
  accent: string
  defaultSize: { width: number; height: number }
  defaultPos: { x: number; y: number }
  Content: ComponentType
}

export const APPS: Record<AppId, AppDef> = {
  about: {
    id: "about",
    title: "About.txt",
    icon: User,
    accent: "bg-clay-indigo/15 text-clay-indigo",
    defaultSize: { width: 760, height: 620 },
    defaultPos: { x: 90, y: 90 },
    Content: AboutApp,
  },
  projects: {
    id: "projects",
    title: "Projects/",
    icon: FolderGit2,
    accent: "bg-clay-sky/20 text-clay-sky",
    defaultSize: { width: 780, height: 580 },
    defaultPos: { x: 150, y: 130 },
    Content: ProjectsApp,
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    icon: TerminalSquare,
    accent: "bg-clay-mint/20 text-clay-mint",
    defaultSize: { width: 680, height: 520 },
    defaultPos: { x: 210, y: 160 },
    Content: TerminalApp,
  },
  contact: {
    id: "contact",
    title: "Contact.app",
    icon: Mail,
    accent: "bg-clay-pink/20 text-clay-pink",
    defaultSize: { width: 780, height: 620 },
    defaultPos: { x: 130, y: 100 },
    Content: ContactApp,
  },
  blog: {
    id: "blog",
    title: "Blog",
    icon: Newspaper,
    accent: "bg-clay-peach/20 text-clay-peach",
    defaultSize: { width: 640, height: 580 },
    defaultPos: { x: 190, y: 175 },
    Content: BlogApp,
  },
  interests: {
    id: "interests",
    title: "Interests",
    icon: Sparkles,
    accent: "bg-clay-pink/20 text-clay-pink",
    defaultSize: { width: 740, height: 620 },
    defaultPos: { x: 230, y: 140 },
    Content: InterestsApp,
  },
}

export const APP_ORDER: AppId[] = ["about", "projects", "terminal", "contact", "blog", "interests"]

export const RESUME_ICON = {
  title: "Resume.pdf",
  icon: FileText,
  accent: "bg-secondary text-foreground",
  href: "/clg_resume_v3.pdf",
}
