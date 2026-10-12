import type { ComponentType } from "react"
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
  defaultSize: { width: number; height: number }
  defaultPos: { x: number; y: number }
  Content: ComponentType
}

export const APPS: Record<AppId, AppDef> = {
  about: {
    id: "about",
    title: "About.txt",
    defaultSize: { width: 760, height: 620 },
    defaultPos: { x: 90, y: 90 },
    Content: AboutApp,
  },
  projects: {
    id: "projects",
    title: "Projects/",
    defaultSize: { width: 780, height: 580 },
    defaultPos: { x: 150, y: 130 },
    Content: ProjectsApp,
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    defaultSize: { width: 680, height: 520 },
    defaultPos: { x: 210, y: 160 },
    Content: TerminalApp,
  },
  contact: {
    id: "contact",
    title: "Contact.app",
    defaultSize: { width: 780, height: 620 },
    defaultPos: { x: 130, y: 100 },
    Content: ContactApp,
  },
  blog: {
    id: "blog",
    title: "Blog",
    defaultSize: { width: 880, height: 580 },
    defaultPos: { x: 190, y: 175 },
    Content: BlogApp,
  },
  interests: {
    id: "interests",
    title: "Interests",
    defaultSize: { width: 740, height: 620 },
    defaultPos: { x: 230, y: 140 },
    Content: InterestsApp,
  },
}

export const APP_ORDER: AppId[] = ["about", "projects", "terminal", "contact", "blog", "interests"]

// Drawn by <AppIcon app="resume" />.
export const RESUME_ICON = {
  title: "Resume.pdf",
  href: "/clg_resume_v3.pdf",
}
