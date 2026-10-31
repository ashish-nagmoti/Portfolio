import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not found | Ashish Nagmoti",
  robots: { index: false },
}

/**
 * A missing page, in the desktop's look: the default wallpaper behind a glass
 * dialog, like Finder telling you an item can't be found. Classes are spelled
 * out here because the shared constants live in client modules.
 */
export default function NotFound() {
  return (
    <main className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-[#0a1222] px-4">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center bg-[url('/wallpapers/glass-light.jpg')] dark:bg-[url('/wallpapers/glass-dark.jpg')]" />
      <div className="relative w-full max-w-[340px] rounded-[22px] border border-white/45 bg-white/60 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_60px_-16px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-[1.8] dark:border-white/[0.09] dark:bg-black/40 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_24px_60px_-16px_rgba(0,0,0,0.7)]">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[14px] bg-gradient-to-b from-[#6cb6ff] to-[#1e7cf2] text-[26px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_16px_-6px_rgba(30,124,242,0.8)]">
          ?
        </div>
        <h1 className="text-[17px] font-semibold text-foreground">This page can&apos;t be found</h1>
        <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
          It may have been moved or renamed. Everything else is on the desktop.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-9 w-full items-center justify-center rounded-[10px] bg-[#0a84ff] text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-colors hover:bg-[#0077ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]/50 focus-visible:ring-offset-2"
        >
          Go to the desktop
        </Link>
      </div>
    </main>
  )
}
