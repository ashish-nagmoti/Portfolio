import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const SIZES = {
  sm: { box: "h-7 w-7", icon: "h-3.5 w-3.5" },
  md: { box: "h-9 w-9", icon: "h-4 w-4" },
  lg: { box: "h-11 w-11", icon: "h-5 w-5" },
} as const

interface IconBadgeProps {
  icon: LucideIcon
  gradient: string
  size?: keyof typeof SIZES
  iconClassName?: string
  className?: string
}

// Same squircle + gradient + gloss treatment as the desktop/Dock app icons,
// scaled down for inline use in card headers and list rows — keeps content
// pages visually consistent with the OS chrome instead of the old flat,
// pale-tinted circle badges.
export function IconBadge({ icon: Icon, gradient, size = "md", iconClassName, className }: IconBadgeProps) {
  const s = SIZES[size]
  return (
    <span className={cn("relative inline-block shrink-0 rounded-[22%] shadow-sm", s.box, className)}>
      <span className={cn("squircle absolute inset-0 flex items-center justify-center bg-gradient-to-b", gradient)}>
        <span className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent" />
        <Icon className={cn("relative drop-shadow-sm", iconClassName ?? "text-white", s.icon)} strokeWidth={2.25} />
      </span>
    </span>
  )
}
