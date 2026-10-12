import sanitizeHtml from "sanitize-html"
import type { MediumFeed, MediumPost } from "@/lib/medium"

// Medium's RSS carries each story's full HTML, but sends no CORS header, so the
// browser can't read it directly. This route reads it server-side and serves
// it as JSON, regenerated at most hourly: visitors get a cached response and
// Medium sees one request an hour.
export const dynamic = "force-static"
export const revalidate = 3600

const FEED = "https://medium.com/feed/@ashishnagmoti7"
const WORDS_PER_MINUTE = 238

const cdata = (s: string | undefined) => (s ?? "").replace(/^\s*<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim()
// Tags may carry attributes (Medium's <guid isPermaLink="false">), so allow them.
const tag = (item: string, name: string) =>
  item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`))?.[1]

const decodeEntities = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")

const textOf = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()

function clean(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h1", "h2", "h3", "h4", "strong", "em", "b", "i", "a", "ul", "ol", "li",
      "blockquote", "figure", "figcaption", "img", "pre", "code", "hr", "br",
    ],
    allowedAttributes: { a: ["href"], img: ["src", "alt"] },
    allowedSchemes: ["https", "http"],
    // Medium appends a 1x1 tracking pixel to every story in the feed.
    exclusiveFilter: (frame) => frame.tag === "img" && /\/_\/stat\b/.test(frame.attribs.src ?? ""),
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
      }),
    },
  })
}

function parse(xml: string): MediumPost[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const raw = cdata(tag(item, "content:encoded"))
    const html = clean(raw)
    const title = decodeEntities(cdata(tag(item, "title")))
    // The opening paragraph, skipping short ones and ones that just repeat the title.
    const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, p]) => textOf(p))
    const excerpt =
      paragraphs.find((p) => p.length >= 60 && !p.toLowerCase().startsWith(title.toLowerCase())) ?? paragraphs[0] ?? ""
    const guid = cdata(tag(item, "guid"))
    const url = cdata(tag(item, "link")).replace(/\?source=.*$/, "")
    return {
      // Medium's post ID (guid is https://medium.com/p/<id>), matching the Blog app's fallback list.
      id: guid.split("/").pop() || url,
      title,
      url,
      date: new Date(cdata(tag(item, "pubDate"))).toISOString().slice(0, 10),
      tags: [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map(([, c]) => cdata(c)),
      excerpt,
      readMinutes: Math.max(1, Math.round(textOf(html).split(" ").length / WORDS_PER_MINUTE)),
      html,
    }
  })
}

export async function GET() {
  const fetchedAt = new Date().toISOString()
  try {
    const res = await fetch(FEED, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; ashish-nagmoti.tech)" },
      next: { revalidate },
    })
    if (!res.ok) throw new Error(`Medium responded ${res.status}`)
    const posts = parse(await res.text())
    if (posts.length === 0) throw new Error("Medium feed had no stories")
    return Response.json({ posts, fetchedAt } satisfies MediumFeed)
  } catch (e) {
    // Never fail the build over Medium: the Blog app falls back to its built-in list.
    return Response.json({ posts: [], fetchedAt, error: e instanceof Error ? e.message : String(e) } satisfies MediumFeed)
  }
}
