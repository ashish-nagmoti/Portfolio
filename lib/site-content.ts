import { z } from "zod"
import raw from "@/content/site.json"

/*
 * Everything on the home screen that changes over time: the Currently
 * widget, Interests, Stack, the mantra, the featured project, stats and the
 * status line. It lives in content/site.json, which the /admin page edits by
 * committing to GitHub; the site reads it at build time, so a save is live
 * once Vercel finishes redeploying.
 */

export const CURRENTLY_KINDS = ["building", "reading", "watching", "learning", "listening", "playing"] as const
export const INTEREST_TYPES = ["blog", "video", "article"] as const
export const FEATURED_ICONS = ["shield", "brain", "cube", "globe", "code", "sparkle"] as const

const text = (max: number) => z.string().trim().min(1, "Required").max(max, `At most ${max} characters`)
const optionalUrl = z.union([z.literal(""), z.string().trim().url("Must be a full URL (https://…)")])

export const siteContentSchema = z.object({
  status: text(60),
  mantra: text(120),
  stats: z.object({ leetcode: text(10), repos: text(10) }),
  currently: z
    .array(z.object({ kind: z.enum(CURRENTLY_KINDS), value: text(80), url: optionalUrl }))
    .max(5, "At most 5 rows"),
  stack: z.array(text(24)).max(12, "At most 12 items"),
  featured: z.object({
    name: text(40),
    badge: z.string().trim().max(60),
    summary: text(200),
    tags: z.array(text(24)).max(6, "At most 6 tags"),
    icon: z.enum(FEATURED_ICONS),
  }),
  interests: z
    .array(
      z.object({
        id: text(40),
        type: z.enum(INTEREST_TYPES),
        title: text(140),
        author: text(80),
        url: z.string().trim().url("Must be a full URL (https://…)"),
        dateAdded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
      }),
    )
    .max(100),
})

export type SiteContent = z.infer<typeof siteContentSchema>
export type CurrentlyKind = (typeof CURRENTLY_KINDS)[number]

/** The content as of this build. Parsed so a hand-edited file that's invalid fails the build, not the page. */
export const siteContent: SiteContent = siteContentSchema.parse(raw)

export const CURRENTLY_LABEL: Record<CurrentlyKind, string> = {
  building: "Building",
  reading: "Reading",
  watching: "Watching",
  learning: "Learning",
  listening: "Listening",
  playing: "Playing",
}
