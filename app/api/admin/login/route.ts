import { cookies } from "next/headers"
import { SESSION_COOKIE, adminConfigured, checkPassword, isAdmin, newSession } from "@/lib/admin-auth"

/** GET: is this browser signed in? POST {password}: sign in. DELETE: sign out. */

export async function GET() {
  return Response.json({ configured: adminConfigured(), signedIn: await isAdmin() })
}

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return Response.json({ error: "Set ADMIN_PASSWORD in Vercel to enable the admin." }, { status: 503 })
  }
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null
  const password = typeof body?.password === "string" ? body.password : ""
  if (!checkPassword(password)) {
    // Slow down guessing
    await new Promise((r) => setTimeout(r, 800))
    return Response.json({ error: "Wrong password." }, { status: 401 })
  }
  const session = newSession()
  const jar = await cookies()
  jar.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: session.expires,
  })
  return Response.json({ ok: true })
}

export async function DELETE() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
  return Response.json({ ok: true })
}
