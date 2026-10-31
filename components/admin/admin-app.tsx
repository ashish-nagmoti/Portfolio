"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowSquareOut,
  ArrowUp,
  ArrowDown,
  Check,
  LockSimple,
  Plus,
  SignOut,
  Trash,
  Warning,
  CaretDown,
} from "@phosphor-icons/react"
import {
  CURRENTLY_KINDS,
  CURRENTLY_LABEL,
  FEATURED_ICONS,
  INTEREST_TYPES,
  siteContentSchema,
  type SiteContent,
} from "@/lib/site-content"
import { CURRENTLY_META, FEATURED_ICON } from "@/components/os/content-meta"
import { cn } from "@/lib/utils"

/*
 * /admin: edit what the home screen shows (content/site.json). Saving commits
 * the file to GitHub and Vercel redeploys, so changes are live in ~2 minutes.
 * Laid out like System Settings: grouped sections, one Save bar.
 */

const FIELD =
  "w-full rounded-[9px] border border-black/[0.1] bg-background px-3 py-2 text-[15px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25 dark:border-white/[0.12] sm:text-[14px]"
const today = () => new Date().toISOString().slice(0, 10)

function Section({ title, hint, children, action }: { title: string; hint?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
          {hint && <p className="text-[12px] text-muted-foreground/80">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-card shadow-sm dark:border-white/[0.08]">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 border-b border-black/[0.06] px-4 py-3 last:border-b-0 dark:border-white/[0.08] sm:flex-row sm:items-center sm:gap-4">
      <span className="shrink-0 text-[14px] font-medium sm:w-36">{label}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  )
}

function SmallButton({ onClick, label, children, danger }: { onClick: () => void; label: string; children: ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
        danger ? "text-red-500 hover:bg-red-500/10" : "text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.08]",
      )}
    >
      {children}
    </button>
  )
}

function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-[13px] font-medium text-primary hover:bg-primary/10">
      <Plus weight="bold" className="h-3.5 w-3.5" />
      {children}
    </button>
  )
}

/** "interests.0.title" → "Interests #1 › Title", for the save bar. */
function describe(issue: { path: (string | number)[]; message: string }) {
  const where = issue.path
    .map((p) => (typeof p === "number" ? `#${p + 1}` : p[0].toUpperCase() + p.slice(1)))
    .join(" › ")
    .replace(/ › #/g, " #")
  return `${where}: ${issue.message}`
}

function move<T>(list: T[], i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

function Login({ onDone, configured }: { onDone: () => void; configured: boolean }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    setBusy(false)
    if (res.ok) onDone()
    else setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Couldn't sign in.")
  }
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border border-black/[0.06] bg-card p-6 shadow-xl dark:border-white/[0.08]">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LockSimple weight="fill" className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-bold">Admin</h1>
          <p className="text-[13px] text-muted-foreground">Edit what the home screen shows.</p>
        </div>
        {!configured && (
          <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-[13px] text-amber-700 dark:text-amber-400">
            Set <code>ADMIN_PASSWORD</code> in Vercel → Settings → Environment Variables, then redeploy.
          </p>
        )}
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={FIELD}
        />
        {error && <p className="text-[13px] text-red-500">{error}</p>}
        <button
          disabled={busy || !password}
          className="w-full rounded-xl bg-primary py-2.5 text-[15px] font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}

function InterestEditor({
  item,
  onChange,
  onDelete,
}: {
  item: SiteContent["interests"][number]
  onChange: (next: SiteContent["interests"][number]) => void
  onDelete: () => void
}) {
  // A just-added (still empty) interest opens ready to fill in
  const [open, setOpen] = useState(!item.title)
  return (
    <div className="border-b border-black/[0.06] last:border-b-0 dark:border-white/[0.08]">
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="w-14 shrink-0 rounded-md bg-black/[0.05] px-1.5 py-0.5 text-center text-[11px] font-semibold uppercase text-muted-foreground dark:bg-white/[0.08]">
            {item.type}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-medium">{item.title || "Untitled"}</span>
            <span className="block truncate text-[12px] text-muted-foreground">
              {item.author} · {item.dateAdded}
            </span>
          </span>
          <CaretDown className={cn("ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
        <SmallButton onClick={onDelete} label="Delete" danger>
          <Trash className="h-4 w-4" />
        </SmallButton>
      </div>
      {open && (
        <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2">
          <input className={cn(FIELD, "sm:col-span-2")} placeholder="Title" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} />
          <input className={FIELD} placeholder="Source (author, site, channel)" value={item.author} onChange={(e) => onChange({ ...item, author: e.target.value })} />
          <select className={FIELD} value={item.type} onChange={(e) => onChange({ ...item, type: e.target.value as typeof item.type })}>
            {INTEREST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t[0].toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <input className={cn(FIELD, "sm:col-span-2")} placeholder="https://…" inputMode="url" value={item.url} onChange={(e) => onChange({ ...item, url: e.target.value })} />
          <input className={FIELD} type="date" value={item.dateAdded} onChange={(e) => onChange({ ...item, dateAdded: e.target.value })} />
        </div>
      )}
    </div>
  )
}

function Editor({ initial, sha: initialSha, githubConfigured, onSignOut }: { initial: SiteContent; sha: string | null; githubConfigured: boolean; onSignOut: () => void }) {
  const [content, setContent] = useState(initial)
  const [saved, setSaved] = useState(JSON.stringify(initial))
  const [sha, setSha] = useState(initialSha)
  const [state, setState] = useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string; url?: string }>({ kind: "idle" })
  const [newStack, setNewStack] = useState("")

  const dirty = JSON.stringify(content) !== saved
  const validation = useMemo(() => siteContentSchema.safeParse(content), [content])
  const problem = validation.success ? null : describe(validation.error.issues[0])
  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => setContent((c) => ({ ...c, [key]: value }))

  // Don't lose edits to a stray tab close
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const save = async () => {
    setState({ kind: "saving" })
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, sha }),
    })
    const out = (await res.json().catch(() => ({}))) as { error?: string; sha?: string; commitUrl?: string }
    if (!res.ok) return setState({ kind: "error", message: out.error ?? `Save failed (${res.status}).` })
    setSha(out.sha ?? null)
    setSaved(JSON.stringify(content))
    setState({ kind: "saved", url: out.commitUrl })
  }

  return (
    <div className="min-h-[100dvh] bg-[#f2f2f7] pb-28 dark:bg-background">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#f2f2f7]/85 backdrop-blur-xl dark:border-white/[0.08] dark:bg-background/85">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h1 className="text-[17px] font-bold">Home screen content</h1>
            <p className="truncate text-[12px] text-muted-foreground">Saves commit to GitHub; live in about 2 minutes.</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <a href="/" target="_blank" className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-primary hover:bg-primary/10">
              View site <ArrowSquareOut className="h-3.5 w-3.5" />
            </a>
            <SmallButton onClick={onSignOut} label="Sign out">
              <SignOut className="h-4 w-4" />
            </SmallButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-7 px-4 pt-6">
        {!githubConfigured && (
          <p className="flex items-start gap-2 rounded-2xl bg-amber-500/10 px-4 py-3 text-[13px] text-amber-800 dark:text-amber-300">
            <Warning weight="fill" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              You can edit, but saving needs <code className="font-semibold">GITHUB_TOKEN</code> in Vercel (a fine-grained token with
              Contents: read &amp; write on the Portfolio repo).
            </span>
          </p>
        )}

        <Section title="Profile">
          <Row label="Status line">
            <input className={FIELD} value={content.status} onChange={(e) => set("status", e.target.value)} placeholder="Open to collaboration" />
          </Row>
          <Row label="Mantra">
            <input className={FIELD} value={content.mantra} onChange={(e) => set("mantra", e.target.value)} />
          </Row>
          <Row label="LeetCode solved">
            <input className={FIELD} value={content.stats.leetcode} onChange={(e) => set("stats", { ...content.stats, leetcode: e.target.value })} placeholder="100+" />
          </Row>
          <Row label="GitHub repos">
            <input className={FIELD} value={content.stats.repos} onChange={(e) => set("stats", { ...content.stats, repos: e.target.value })} placeholder="45+" />
          </Row>
        </Section>

        <Section
          title="Currently"
          hint="The Currently widget. A link opens in a new tab; without one, the row opens the matching app."
          action={
            content.currently.length < 5 && (
              <AddButton onClick={() => set("currently", [...content.currently, { kind: "reading", value: "", url: "" }])}>Add row</AddButton>
            )
          }
        >
          {content.currently.length === 0 && <p className="px-4 py-4 text-[14px] text-muted-foreground">Nothing yet. The widget hides when empty.</p>}
          {content.currently.map((row, i) => {
            const Icon = CURRENTLY_META[row.kind].icon
            const update = (patch: Partial<typeof row>) => set("currently", content.currently.map((r, j) => (j === i ? { ...r, ...patch } : r)))
            return (
              <div key={i} className="flex flex-col gap-2 border-b border-black/[0.06] px-4 py-3 last:border-b-0 dark:border-white/[0.08] sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 sm:w-40">
                  <Icon weight="fill" className={cn("h-5 w-5 shrink-0", CURRENTLY_META[row.kind].tint)} />
                  <select className={FIELD} value={row.kind} onChange={(e) => update({ kind: e.target.value as typeof row.kind })}>
                    {CURRENTLY_KINDS.map((k) => (
                      <option key={k} value={k}>
                        {CURRENTLY_LABEL[k]}
                      </option>
                    ))}
                  </select>
                </div>
                <input className={cn(FIELD, "sm:flex-1")} placeholder="What, e.g. Designing Data-Intensive Applications" value={row.value} onChange={(e) => update({ value: e.target.value })} />
                <div className="flex items-center gap-1">
                  <input className={cn(FIELD, "sm:w-44")} placeholder="Link (optional)" inputMode="url" value={row.url} onChange={(e) => update({ url: e.target.value })} />
                  <SmallButton onClick={() => set("currently", move(content.currently, i, -1))} label="Move up">
                    <ArrowUp className="h-4 w-4" />
                  </SmallButton>
                  <SmallButton onClick={() => set("currently", move(content.currently, i, 1))} label="Move down">
                    <ArrowDown className="h-4 w-4" />
                  </SmallButton>
                  <SmallButton onClick={() => set("currently", content.currently.filter((_, j) => j !== i))} label="Delete" danger>
                    <Trash className="h-4 w-4" />
                  </SmallButton>
                </div>
              </div>
            )
          })}
        </Section>

        <Section title="Featured project" hint="The Featured widget on the desktop and on the phone's second page.">
          <Row label="Name">
            <input className={FIELD} value={content.featured.name} onChange={(e) => set("featured", { ...content.featured, name: e.target.value })} />
          </Row>
          <Row label="Badge">
            <input className={FIELD} placeholder="e.g. 1st place, Sharp Tank (optional)" value={content.featured.badge} onChange={(e) => set("featured", { ...content.featured, badge: e.target.value })} />
          </Row>
          <Row label="Summary">
            <textarea rows={2} className={cn(FIELD, "resize-none")} value={content.featured.summary} onChange={(e) => set("featured", { ...content.featured, summary: e.target.value })} />
          </Row>
          <Row label="Tags">
            <input
              className={FIELD}
              placeholder="Comma-separated"
              value={content.featured.tags.join(", ")}
              onChange={(e) => set("featured", { ...content.featured, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
            />
          </Row>
          <Row label="Icon">
            <span className="flex flex-wrap gap-2">
              {FEATURED_ICONS.map((key) => {
                const Icon = FEATURED_ICON[key]
                const active = content.featured.icon === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set("featured", { ...content.featured, icon: key })}
                    aria-label={key}
                    aria-pressed={active}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                      active ? "bg-primary text-primary-foreground" : "bg-black/[0.05] text-foreground/70 dark:bg-white/[0.08]",
                    )}
                  >
                    <Icon weight="fill" className="h-5 w-5" />
                  </button>
                )
              })}
            </span>
          </Row>
        </Section>

        <Section title="Stack" hint="Chips in the Stack widget.">
          <div className="flex flex-wrap gap-2 px-4 py-3">
            {content.stack.map((t, i) => (
              <span key={t + i} className="flex items-center gap-1 rounded-lg bg-black/[0.05] py-1 pl-2.5 pr-1 text-[13px] font-medium dark:bg-white/[0.08]">
                {t}
                <button type="button" onClick={() => set("stack", content.stack.filter((_, j) => j !== i))} aria-label={`Remove ${t}`} className="rounded p-0.5 text-muted-foreground hover:text-red-500">
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const t = newStack.trim()
                if (t && !content.stack.includes(t)) set("stack", [...content.stack, t])
                setNewStack("")
              }}
              className="flex items-center gap-1"
            >
              <input className={cn(FIELD, "w-36 py-1")} placeholder="Add, then Enter" value={newStack} onChange={(e) => setNewStack(e.target.value)} />
            </form>
          </div>
        </Section>

        <Section
          title={`Interests (${content.interests.length})`}
          hint="The Interests app, newest first. Tap a row to edit it."
          action={
            <AddButton
              onClick={() =>
                set("interests", [
                  { id: crypto.randomUUID(), type: "article", title: "", author: "", url: "", dateAdded: today() },
                  ...content.interests,
                ])
              }
            >
              Add interest
            </AddButton>
          }
        >
          {[...content.interests]
            .map((item, index) => ({ item, index }))
            .sort((a, b) => (a.item.dateAdded < b.item.dateAdded ? 1 : -1))
            .map(({ item, index }) => (
              <InterestEditor
                key={item.id}
                item={item}
                onChange={(next) => set("interests", content.interests.map((x, j) => (j === index ? next : x)))}
                onDelete={() => set("interests", content.interests.filter((_, j) => j !== index))}
              />
            ))}
        </Section>
      </main>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[calc(env(safe-area-inset-bottom)+14px)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-black/[0.08] bg-card/90 px-4 py-3 shadow-2xl backdrop-blur-xl dark:border-white/[0.1]">
          <p className="line-clamp-2 min-w-0 flex-1 text-[13px] sm:truncate">
            {problem ? (
              <span className="text-red-500">{problem}</span>
            ) : state.kind === "error" ? (
              <span className="text-red-500">{state.message}</span>
            ) : state.kind === "saved" && !dirty ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Check weight="bold" className="h-4 w-4" />
                Saved. Live in about 2 minutes.
                {state.url && (
                  <a href={state.url} target="_blank" rel="noopener noreferrer" className="underline">
                    View commit
                  </a>
                )}
              </span>
            ) : dirty ? (
              <span className="text-muted-foreground">Unsaved changes</span>
            ) : (
              <span className="text-muted-foreground">Everything is saved</span>
            )}
          </p>
          {dirty && (
            <button type="button" onClick={() => setContent(JSON.parse(saved))} className="rounded-xl px-3 py-2 text-[14px] font-medium text-muted-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.08]">
              Discard
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || !!problem || state.kind === "saving" || !githubConfigured}
            className="rounded-xl bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            {state.kind === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminApp() {
  const [phase, setPhase] = useState<"loading" | "login" | "ready" | "error">("loading")
  const [configured, setConfigured] = useState(true)
  const [data, setData] = useState<{ content: SiteContent; sha: string | null; githubConfigured: boolean } | null>(null)
  const [error, setError] = useState("")

  const load = async () => {
    setPhase("loading")
    const auth = (await (await fetch("/api/admin/login")).json()) as { configured: boolean; signedIn: boolean }
    setConfigured(auth.configured)
    if (!auth.signedIn) return setPhase("login")
    const res = await fetch("/api/admin/content")
    const out = await res.json()
    if (!res.ok) {
      setError(out.error ?? `Couldn't load content (${res.status}).`)
      return setPhase("error")
    }
    setData(out)
    setPhase("ready")
  }

  useEffect(() => {
    load()
  }, [])

  const signOut = async () => {
    await fetch("/api/admin/login", { method: "DELETE" })
    setData(null)
    setPhase("login")
  }

  if (phase === "loading") return <div className="flex min-h-[100dvh] items-center justify-center bg-background text-muted-foreground">Loading…</div>
  if (phase === "login") return <Login configured={configured} onDone={load} />
  if (phase === "error" || !data)
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="text-red-500">{error}</p>
        <button onClick={load} className="rounded-xl bg-primary px-4 py-2 text-primary-foreground">
          Try again
        </button>
      </div>
    )
  return <Editor initial={data.content} sha={data.sha} githubConfigured={data.githubConfigured} onSignOut={signOut} />
}
