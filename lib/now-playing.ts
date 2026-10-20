/** What /api/now-playing returns. */
export type NowPlaying =
  | { configured: false }
  | {
      configured: true
      /** True while a track is playing; false means `track` is the last one played. */
      isPlaying: boolean
      track: {
        title: string
        artist: string
        album?: string
        art?: string
        url?: string
        /** Spotify only: position and length, for the progress bar. */
        progressMs?: number
        durationMs?: number
      } | null
      source: "spotify" | "lastfm"
      /** When the server fetched this, so the client can advance the progress bar. */
      fetchedAt: number
    }
