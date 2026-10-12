import type { Icon as IconType } from "@phosphor-icons/react"
import { EnvelopeSimple, FilePdf, FolderSimple, Heart, Terminal } from "@phosphor-icons/react"
import type { AppId } from "./types"
import { cn } from "@/lib/utils"

export type AppIconKey = AppId | "resume"

/**
 * The app icons, in the style of current macOS (Liquid Glass): a vivid
 * gradient tile with a specular sheen and a lit glass rim, carrying a frosted
 * glyph that casts a soft shadow onto it. Each one follows its real macOS
 * counterpart — Notes for the blog, Mail for contact, Terminal, a folder for
 * projects, a Contacts monogram for About, a PDF for the resume.
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

function Glass({ className, children }: { className: string; children?: React.ReactNode }) {
  return (
    <span className="absolute inset-0">
      {/* Depth: a tight contact shadow plus a soft ambient one. */}
      <span className="absolute inset-[2%] rounded-[24%] shadow-[0_1px_2px_rgba(0,0,0,0.28),0_6px_14px_rgba(0,0,0,0.22)]" />
      <span className={cn("squircle absolute inset-0 overflow-hidden", className)}>
        {/* Specular sheen across the top-left. */}
        <span className="absolute inset-0 bg-[radial-gradient(130%_85%_at_18%_-6%,rgba(255,255,255,0.6),rgba(255,255,255,0.12)_42%,rgba(255,255,255,0)_62%)]" />
        {/* Ambient falloff toward the bottom edge. */}
        <span className="absolute inset-0 bg-gradient-to-b from-transparent from-55% to-black/[0.14]" />
        {children}
        {/* The glass rim: a lit top edge, a fine all-round highlight, a darker base. */}
        <span className="absolute inset-0 rounded-[22%] shadow-[inset_0_1.5px_0.5px_rgba(255,255,255,0.75),inset_0_0_0_1px_rgba(255,255,255,0.2),inset_0_-1.5px_1px_rgba(0,0,0,0.16)]" />
      </span>
    </span>
  )
}

/** A frosted glyph: the glass gradient fill, with its own shadow beneath. */
function Glyph({ icon: Icon, solid, size = "58%" }: { icon: IconType; solid?: string; size?: string }) {
  return (
    <span
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size }}
    >
      <Icon weight="fill" className="absolute inset-0 h-full w-full translate-y-[5%] text-black/30 blur-[1.5px]" />
      <Icon
        weight="fill"
        className={cn("absolute inset-0 h-full w-full", solid ?? "fill-[url(#glyph-glass)] text-white")}
      />
    </span>
  )
}

const ART: Record<AppIconKey, React.ReactNode> = {
  // Contacts: graphite glass with a frosted monogram.
  about: (
    <Glass className="bg-gradient-to-b from-[#a4a4ab] via-[#7c7c84] to-[#55555c]">
      {/* SVG so the monogram scales with the tile, from 16px title bars to the Dock. */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <text x="50" y="55" textAnchor="middle" dominantBaseline="central" fill="#000" fillOpacity="0.28"
          fontSize="40" fontWeight="600" fontFamily="-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif"
          style={{ filter: "blur(1.5px)" }}>AN</text>
        <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fill="url(#glyph-glass)"
          fontSize="40" fontWeight="600" fontFamily="-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif">AN</text>
      </svg>
    </Glass>
  ),

  // Projects: a folder on cyan-blue glass.
  projects: (
    <Glass className="bg-gradient-to-b from-[#6fdcff] via-[#2fb2f6] to-[#0b84e6]">
      <Glyph icon={FolderSimple} />
    </Glass>
  ),

  // Terminal: dark glass, a bright prompt.
  terminal: (
    <Glass className="bg-gradient-to-b from-[#56565c] via-[#2a2a2e] to-[#0e0e10]">
      <Glyph icon={Terminal} size="56%" />
    </Glass>
  ),

  // Mail: deep blue glass, frosted envelope.
  contact: (
    <Glass className="bg-gradient-to-b from-[#5aa8ff] via-[#2f7cff] to-[#1349e0]">
      <Glyph icon={EnvelopeSimple} />
    </Glass>
  ),

  // Notes: white glass page, glossy yellow header, soft ruled lines.
  blog: (
    <Glass className="bg-gradient-to-b from-white via-[#fafafa] to-[#e9e9ee]">
      <span className="absolute inset-x-0 top-0 h-[32%] bg-gradient-to-b from-[#ffe877] via-[#ffd63a] to-[#ffc414]">
        <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#d9a400]/50" />
      </span>
      <span className="absolute left-[18%] right-[18%] top-[50%] h-[4.5%] rounded-full bg-[#cfcfd6]" />
      <span className="absolute left-[18%] right-[18%] top-[64%] h-[4.5%] rounded-full bg-[#cfcfd6]" />
      <span className="absolute left-[18%] right-[40%] top-[78%] h-[4.5%] rounded-full bg-[#cfcfd6]" />
    </Glass>
  ),

  // Liked items: green glass, frosted heart — matching the app inside.
  interests: (
    <Glass className="bg-gradient-to-b from-[#5cf095] via-[#23cc62] to-[#0c9e45]">
      <Glyph icon={Heart} size="54%" />
    </Glass>
  ),

  // Resume: white glass, a red PDF glyph.
  resume: (
    <Glass className="bg-gradient-to-b from-white via-[#f6f6f8] to-[#e4e4ea]">
      <Glyph icon={FilePdf} solid="text-[#ff3b30]" />
    </Glass>
  ),
}
