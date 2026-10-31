import { isAdmin } from "@/lib/admin-auth"
import { siteContent, siteContentSchema } from "@/lib/site-content"

/*
 * GET: the current content/site.json, read from GitHub so it includes saves
 * that haven't finished deploying yet. PUT {content, sha}: validate and commit
 * it; Vercel redeploys on the push. `sha` is the version the editor loaded, so
 * a save over someone else's newer commit is refused instead of lost.
 *
 * Needs GITHUB_TOKEN: a fine-grained token with Contents read/write on the
 * repo. GITHUB_REPO and GITHUB_BRANCH default to this site's repo and branch.
 */

const REPO = process.env.GITHUB_REPO || "ashish-nagmoti/Portfolio"
const BRANCH = process.env.GITHUB_BRANCH || "master"
const FILE = "content/site.json"
const API = `https://api.github.com/repos/${REPO}/contents/${FILE}`

const gh = (init?: RequestInit) =>
  fetch(init?.method === "PUT" ? API : `${API}?ref=${BRANCH}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
  })

const unauthorized = () => Response.json({ error: "Not signed in." }, { status: 401 })

export async function GET() {
  if (!(await isAdmin())) return unauthorized()
  if (!process.env.GITHUB_TOKEN) {
    // Still let the editor open, so it can be tried before the token is set
    return Response.json({ content: siteContent, sha: null, githubConfigured: false })
  }
  const res = await gh()
  if (!res.ok) return Response.json({ error: `GitHub said ${res.status} reading ${FILE}.` }, { status: 502 })
  const file = (await res.json()) as { content: string; sha: string }
  const parsed = siteContentSchema.safeParse(JSON.parse(Buffer.from(file.content, "base64").toString("utf8")))
  return Response.json({
    content: parsed.success ? parsed.data : siteContent,
    sha: file.sha,
    githubConfigured: true,
  })
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  if (!process.env.GITHUB_TOKEN) {
    return Response.json({ error: "Add GITHUB_TOKEN in Vercel so saves can be committed." }, { status: 503 })
  }
  const body = (await req.json().catch(() => null)) as { content?: unknown; sha?: unknown } | null
  const parsed = siteContentSchema.safeParse(body?.content)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return Response.json({ error: `${issue.path.join(" › ")}: ${issue.message}` }, { status: 400 })
  }

  const json = JSON.stringify(parsed.data, null, 2) + "\n"
  const res = await gh({
    method: "PUT",
    body: JSON.stringify({
      message: "Update site content from /admin",
      content: Buffer.from(json, "utf8").toString("base64"),
      sha: typeof body?.sha === "string" ? body.sha : undefined,
      branch: BRANCH,
    }),
  })
  if (res.status === 409 || res.status === 422) {
    return Response.json({ error: "The content changed since you opened it. Reload, then make your edit again." }, { status: 409 })
  }
  if (!res.ok) return Response.json({ error: `GitHub said ${res.status} saving ${FILE}.` }, { status: 502 })
  const out = (await res.json()) as { content: { sha: string }; commit: { html_url: string } }
  return Response.json({ sha: out.content.sha, commitUrl: out.commit.html_url })
}
