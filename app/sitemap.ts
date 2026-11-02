import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/profile"

// Every page of the site; the date is the deploy that built it
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  })
  return [
    page("", 1, "monthly"),
    page("/about", 0.9, "monthly"),
    page("/projects", 0.9, "monthly"),
    page("/blog", 0.7, "weekly"),
    page("/interests", 0.5, "weekly"),
    page("/contact", 0.6, "monthly"),
  ]
}
