import type { Icon as IconType } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const SIZES = {
  sm: { box: "h-7 w-7", icon: "h-4 w-4" },
  md: { box: "h-9 w-9", icon: "h-5 w-5" },
  lg: { box: "h-11 w-11", icon: "h-6 w-6" },
  xl: { box: "h-16 w-16", icon: "h-8 w-8" },
} as const

interface IconBadgeProps {
  icon: IconType
  /** Tile background, e.g. one of the `SYSTEM` colours below. */
  gradient: string
  size?: keyof typeof SIZES
  /** Color override only (e.g. "text-slate-700") — replaces the white default entirely, so never pass a size class here. Use `size` for that. */
  iconClassName?: string
  className?: string
}

/**
 * macOS system colours as icon tiles, in the style of System Settings: a
 * solid colour with a faint top-to-bottom shade, never a two-hue gradient.
 */
export const SYSTEM = {
  blue: "bg-gradient-to-b from-[#3a9bff] to-[#0a74f0]",
  green: "bg-gradient-to-b from-[#3ad769] to-[#22b04f]",
  orange: "bg-gradient-to-b from-[#ffaa2c] to-[#f58a00]",
  red: "bg-gradient-to-b from-[#ff5a50] to-[#e5352b]",
  teal: "bg-gradient-to-b from-[#4fd4ee] to-[#1fb3d6]",
  yellow: "bg-gradient-to-b from-[#ffd93b] to-[#f5b800]",
  graphite: "bg-gradient-to-b from-[#9a9aa0] to-[#6e6e74]",
  black: "bg-gradient-to-b from-[#3a3a3c] to-[#1c1c1e]",
} as const

// Same squircle as the Dock icons, scaled down for list rows and card headers.
export function IconBadge({ icon: Icon, gradient, size = "md", iconClassName, className }: IconBadgeProps) {
  const s = SIZES[size]
  return (
    <span className={cn("relative inline-block shrink-0 rounded-[22%] shadow-sm", s.box, className)}>
      <span className={cn("squircle absolute inset-0 flex items-center justify-center", gradient)}>
        <Icon weight="fill" className={cn("relative", iconClassName ?? "text-white", s.icon)} />
      </span>
    </span>
  )
}
