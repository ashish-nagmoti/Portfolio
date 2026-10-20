// One-time helper: gets the SPOTIFY_REFRESH_TOKEN the Now Playing widget needs.
//
// 1. Create an app at https://developer.spotify.com/dashboard and add this
//    Redirect URI to it exactly:  http://127.0.0.1:8888/callback
// 2. Run:  SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-token.mjs
// 3. Open the printed link, approve, and copy the refresh token it prints into
//    Vercel (Settings → Environment Variables) along with the ID and secret.
import http from "node:http"

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.")
  process.exit(1)
}

const REDIRECT = "http://127.0.0.1:8888/callback"
const auth = new URL("https://accounts.spotify.com/authorize")
auth.search = new URLSearchParams({
  client_id: id,
  response_type: "code",
  redirect_uri: REDIRECT,
  scope: "user-read-currently-playing user-read-recently-played",
}).toString()

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT)
  if (url.pathname !== "/callback") return res.writeHead(404).end()
  const code = url.searchParams.get("code")
  if (!code) {
    res.end(`Spotify said: ${url.searchParams.get("error") ?? "no code"}`)
    return
  }
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT }),
  })
  const json = await tokenRes.json()
  if (!json.refresh_token) {
    res.end("Token exchange failed, see the terminal.")
    console.error(json)
  } else {
    res.end("Done. The refresh token is in your terminal; you can close this tab.")
    console.log(`\nSPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`)
  }
  server.close()
})

server.listen(8888, "127.0.0.1", () => {
  console.log(`Open this link and approve access:\n\n${auth}\n`)
})
