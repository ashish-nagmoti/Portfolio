import {
  Hammer,
  BookOpen,
  YoutubeLogo,
  GraduationCap,
  Headphones,
  GameController,
  ShieldCheck,
  Brain,
  Cube,
  Globe,
  Code,
  Sparkle,
  type Icon,
} from "@phosphor-icons/react"
import type { CurrentlyKind, SiteContent } from "@/lib/site-content"
import type { AppId } from "./types"

/** How each kind of "Currently" row looks, and where it leads when it has no link of its own. */
export const CURRENTLY_META: Record<CurrentlyKind, { icon: Icon; tint: string; app: AppId }> = {
  building: { icon: Hammer, tint: "text-blue-500", app: "about" },
  reading: { icon: BookOpen, tint: "text-sky-500", app: "interests" },
  watching: { icon: YoutubeLogo, tint: "text-red-500", app: "interests" },
  learning: { icon: GraduationCap, tint: "text-violet-500", app: "about" },
  listening: { icon: Headphones, tint: "text-emerald-500", app: "interests" },
  playing: { icon: GameController, tint: "text-orange-500", app: "interests" },
}

export const FEATURED_ICON: Record<SiteContent["featured"]["icon"], Icon> = {
  shield: ShieldCheck,
  brain: Brain,
  cube: Cube,
  globe: Globe,
  code: Code,
  sparkle: Sparkle,
}
