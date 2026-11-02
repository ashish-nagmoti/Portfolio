import { getMediumFeed } from "@/lib/medium-feed"

// Medium's RSS carries each story's full HTML, but sends no CORS header, so the
// browser can't read it directly. This route reads it server-side and serves
// it as JSON, regenerated at most hourly: visitors get a cached response and
// Medium sees one request an hour.
export const dynamic = "force-static"
export const revalidate = 3600

export async function GET() {
  return Response.json(await getMediumFeed())
}
