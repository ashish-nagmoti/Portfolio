import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

/*
 * Admin sign-in: one password (ADMIN_PASSWORD, set in Vercel), then a signed,
 * httpOnly session cookie good for 30 days. The signing key defaults to the
 * password itself, so changing the password signs everyone out.
 */

export const SESSION_COOKIE = "admin_session"
const SESSION_DAYS = 30

const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ""

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url")

/** Compare two strings without leaking how much of them matched. */
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest()
  const hb = createHash("sha256").update(b).digest()
  return timingSafeEqual(ha, hb)
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD)

export function checkPassword(password: string) {
  return adminConfigured() && safeEqual(password, process.env.ADMIN_PASSWORD!)
}

export function newSession() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = `v1.${expires}`
  return { value: `${payload}.${sign(payload)}`, expires: new Date(expires) }
}

function validSession(value: string | undefined) {
  if (!value || !adminConfigured()) return false
  const [v, expires, mac] = value.split(".")
  if (v !== "v1" || !expires || !mac) return false
  if (Number(expires) < Date.now()) return false
  return safeEqual(mac, sign(`${v}.${expires}`))
}

export async function isAdmin() {
  const jar = await cookies()
  return validSession(jar.get(SESSION_COOKIE)?.value)
}
