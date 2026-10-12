/** A Medium story, as served by /api/medium. Shared by the route and the Blog app. */
export interface MediumPost {
  id: string
  title: string
  url: string
  /** ISO date (YYYY-MM-DD) of publication. */
  date: string
  /** Medium's tags for the story, e.g. "cloud-computing". */
  tags: string[]
  /** Plain text of the opening paragraph. */
  excerpt: string
  readMinutes: number
  /** The full story, sanitized. */
  html: string
}

export interface MediumFeed {
  posts: MediumPost[]
  fetchedAt: string
  /** Set when the feed couldn't be read; the Blog app falls back to its built-in list. */
  error?: string
}
