import { EnvelopeSimple, FilePdf, Heart, Terminal } from "@phosphor-icons/react"
import type { AppId } from "./types"
import { cn } from "@/lib/utils"

export type AppIconKey = AppId | "resume"

/**
 * The app icons, drawn after their real macOS counterparts rather than as a
 * glyph dropped on an arbitrary gradient: Notes for the blog, a Finder folder
 * for projects, Mail for contact, Terminal, a Contacts-style monogram for
 * About, and a PDF document for the resume.
 *
 * Renders a square that fills its container, so callers size it — the Dock,
 * Spotlight and window title bars all reuse it.
 */
export function AppIcon({ app, className }: { app: AppIconKey; className?: string }) {
  return (
    <span className={cn("relative block aspect-square", className)} aria-hidden>
      {ART[app]}
    </span>
  )
}

// A rounded-square tile with the soft top highlight Big Sur-era icons have.
function Tile({ className, children }: { className: string; children?: React.ReactNode }) {
  return (
    <span className="absolute inset-0 rounded-[22%] shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
      <span className={cn("squircle absolute inset-0 overflow-hidden", className)}>
        <span className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10" />
        {children}
      </span>
    </span>
  )
}

const glyph = "absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2"

const ART: Record<AppIconKey, React.ReactNode> = {
  // Contacts: graphite monogram card.
  about: (
    <Tile className="bg-gradient-to-b from-[#c7c7cc] to-[#8e8e93]">
      {/* SVG so the monogram scales with the tile, from 16px title bars to the Dock. */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="about-disc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#aeaeb2" />
            <stop offset="1" stopColor="#636366" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="34" fill="url(#about-disc)" />
        <text
          x="50"
          y="51"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize="27"
          fontWeight="600"
          fontFamily="-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif"
        >
          AN
        </text>
      </svg>
    </Tile>
  ),

  // Finder folder: no tile, just the folder, as macOS shows folders in the Dock.
  projects: (
    <span className="absolute inset-0">
      <span className="absolute left-[8%] top-[20%] h-[16%] w-[40%] rounded-t-[22%] bg-[#3a95f2]" />
      <span className="absolute inset-x-[6%] bottom-[14%] top-[28%] rounded-[12%] bg-gradient-to-b from-[#78c2ff] to-[#3f9cf4] shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
        <span className="absolute inset-x-0 top-0 h-[10%] rounded-t-[12%] bg-white/30" />
      </span>
    </span>
  ),

  // Terminal: black screen, grey bezel, >_ prompt.
  terminal: (
    <Tile className="bg-gradient-to-b from-[#d1d1d6] to-[#8e8e93]">
      <span className="absolute inset-[10%] rounded-[14%] bg-gradient-to-b from-[#2c2c2e] to-[#0b0b0c]">
        <Terminal weight="bold" className="absolute left-[14%] top-[14%] h-[48%] w-[48%] text-[#e5e5ea]" />
      </span>
    </Tile>
  ),

  // Mail: blue tile, white envelope.
  contact: (
    <Tile className="bg-gradient-to-b from-[#5ebdff] to-[#1272f5]">
      <EnvelopeSimple weight="fill" className={cn(glyph, "text-white")} />
    </Tile>
  ),

  // Notes: white page, yellow header, a perforation and ruled lines.
  blog: (
    <Tile className="bg-[#fbfbfa]">
      <span className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-[#ffe36a] to-[#ffd02b]" />
      <span className="absolute inset-x-[10%] top-[30%] border-t-[1.5px] border-dotted border-[#c9a400]/70" />
      <span className="absolute inset-x-[16%] top-[46%] h-[4%] rounded-full bg-[#d8d8dc]" />
      <span className="absolute inset-x-[16%] top-[60%] h-[4%] rounded-full bg-[#d8d8dc]" />
      <span className="absolute left-[16%] right-[36%] top-[74%] h-[4%] rounded-full bg-[#d8d8dc]" />
    </Tile>
  ),

  // Liked items: green, matching the Spotify-style app inside.
  interests: (
    <Tile className="bg-gradient-to-b from-[#3fe076] to-[#14a447]">
      <Heart weight="fill" className={cn(glyph, "text-white")} />
    </Tile>
  ),

  // PDF document.
  resume: (
    <Tile className="bg-gradient-to-b from-white to-[#ececf0]">
      <FilePdf weight="fill" className={cn(glyph, "text-[#ff3b30]")} />
    </Tile>
  ),
}
