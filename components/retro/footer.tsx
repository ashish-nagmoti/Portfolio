export function Footer() {
  return (
    <footer className="border-t border-[var(--phosphor)]/20 px-4 py-8">
      <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--dim)]">
        <p>© 2025 Ashish Nagmoti — built with Next.js</p>
        <a href="#home" className="hover:text-[var(--phosphor)]">
          [ ^ back to top ]
        </a>
      </div>
    </footer>
  )
}
