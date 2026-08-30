import type { ComponentType } from "react"
import { User, FolderGit2, Newspaper, Mail, Sparkles, TerminalSquare, type LucideIcon } from "lucide-react"
import { AboutContent } from "@/components/content/about-content"
import { ProjectsContent } from "@/components/content/projects-content"
import { BlogContent } from "@/components/content/blog-content"
import { ContactContent } from "@/components/content/contact-content"
import { InterestsContent } from "@/components/content/interests-content"
import { TerminalContent } from "@/components/content/terminal-content"
import type { PanelId } from "./types"

export interface PanelDef {
  title: string
  icon: LucideIcon
  accent: string
  Content: ComponentType
}

export const PANELS: Record<PanelId, PanelDef> = {
  about: { title: "About Me", icon: User, accent: "bg-clay-indigo/15 text-clay-indigo", Content: AboutContent },
  projects: { title: "Projects", icon: FolderGit2, accent: "bg-clay-sky/20 text-clay-sky", Content: ProjectsContent },
  blog: { title: "Blog", icon: Newspaper, accent: "bg-clay-peach/20 text-clay-peach", Content: BlogContent },
  contact: { title: "Contact", icon: Mail, accent: "bg-clay-pink/20 text-clay-pink", Content: ContactContent },
  interests: { title: "Interests", icon: Sparkles, accent: "bg-clay-pink/20 text-clay-pink", Content: InterestsContent },
  terminal: { title: "Terminal", icon: TerminalSquare, accent: "bg-clay-mint/20 text-clay-mint", Content: TerminalContent },
}
