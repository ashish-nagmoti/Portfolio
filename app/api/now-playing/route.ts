import type { NowPlaying } from "@/lib/now-playing"

/**
 * What Ashish is listening to. Reads Spotify when its credentials are set,
 * otherwise Last.fm, otherwise reports `configured: false` (the widget then
 * stays hidden). Cached for 30s so every visitor polling this costs at most
 * a couple of upstream calls a minute.
 *
 * Spotify: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 *   (run `node scripts/spotify-token.mjs` once to get the refresh token)
 * Last.fm: LASTFM_API_KEY, LASTFM_USER
 */
export const revalidate = 30

type Track = Extract<NowPlaying, { configured: true }>["track"]

// Spotify access tokens last an hour; reuse one while it's valid.
let spotifyToken: { value: string; expires: number } | null = null

async function getSpotifyToken() {
  if (spotifyToken && spotifyToken.expires > Date.now() + 60_000) return spotifyToken.value
  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: process.env.SPOTIFY_REFRESH_TOKEN! }),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Spotify token: ${res.status}`)
  const json = (await res.json()) as { access_token: string; expires_in: number }
  spotifyToken = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 }
  return json.access_token
}

interface SpotifyTrack {
  name: string
  duration_ms: number
  artists: { name: string }[]
  album: { name: string; images: { url: string; width: number }[] }
  external_urls: { spotify: string }
}

const fromSpotify = (t: SpotifyTrack, progressMs?: number): NonNullable<Track> => ({
  title: t.name,
  artist: t.artists.map((a) => a.name).join(", "),
  album: t.album.name,
  // Smallest image that's still sharp at 2x in a 56px tile
  art: [...t.album.images].sort((a, b) => a.width - b.width).find((i) => i.width >= 128)?.url ?? t.album.images[0]?.url,
  url: t.external_urls.spotify,
  progressMs,
  durationMs: t.duration_ms,
})

async function spotify(): Promise<{ isPlaying: boolean; track: Track }> {
  const token = await getSpotifyToken()
  const headers = { Authorization: `Bearer ${token}` }
  const now = await fetch("https://api.spotify.com/v1/me/player/currently-playing", { headers, cache: "no-store" })
  if (now.status === 200) {
    const json = (await now.json()) as { is_playing: boolean; progress_ms: number; item: SpotifyTrack | null; currently_playing_type: string }
    // Podcasts and ads come back without a track item
    if (json.item && json.currently_playing_type === "track") {
      return { isPlaying: json.is_playing, track: fromSpotify(json.item, json.progress_ms) }
    }
  }
  const recent = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", { headers, cache: "no-store" })
  if (!recent.ok) throw new Error(`Spotify recently-played: ${recent.status}`)
  const json = (await recent.json()) as { items: { track: SpotifyTrack }[] }
  const last = json.items[0]?.track
  return { isPlaying: false, track: last ? { ...fromSpotify(last), progressMs: undefined, durationMs: undefined } : null }
}

async function lastfm(): Promise<{ isPlaying: boolean; track: Track }> {
  const url = new URL("https://ws.audioscrobbler.com/2.0/")
  url.search = new URLSearchParams({
    method: "user.getrecenttracks",
    user: process.env.LASTFM_USER!,
    api_key: process.env.LASTFM_API_KEY!,
    format: "json",
    limit: "1",
  }).toString()
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Last.fm: ${res.status}`)
  const json = (await res.json()) as {
    recenttracks: {
      track: {
        name: string
        url: string
        artist: { "#text": string }
        album: { "#text": string }
        image: { "#text": string; size: string }[]
        "@attr"?: { nowplaying: string }
      }[]
    }
  }
  const t = json.recenttracks.track[0]
  if (!t) return { isPlaying: false, track: null }
  // Last.fm's placeholder star image means "no art"
  const art = t.image.find((i) => i.size === "large")?.["#text"]
  return {
    isPlaying: t["@attr"]?.nowplaying === "true",
    track: {
      title: t.name,
      artist: t.artist["#text"],
      album: t.album["#text"] || undefined,
      art: art && !art.includes("2a96cbd8b46e442fc41c2b86b821562f") ? art : undefined,
      url: t.url,
    },
  }
}

export async function GET() {
  const hasSpotify = process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_REFRESH_TOKEN
  const hasLastfm = process.env.LASTFM_API_KEY && process.env.LASTFM_USER
  if (!hasSpotify && !hasLastfm) return Response.json({ configured: false } satisfies NowPlaying)

  try {
    const { isPlaying, track } = hasSpotify ? await spotify() : await lastfm()
    const body: NowPlaying = {
      configured: true,
      isPlaying,
      track,
      source: hasSpotify ? "spotify" : "lastfm",
      fetchedAt: Date.now(),
    }
    return Response.json(body)
  } catch (err) {
    // Keep the widget quiet rather than broken if the upstream hiccups
    console.error("now-playing:", err)
    return Response.json({ configured: false } satisfies NowPlaying)
  }
}
