import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// macOS apps (System Settings, Contacts, Mail prefs) group related rows into
// a bordered, rounded container with hairline dividers between rows instead
// of a separate drop-shadowed card per item — this is that pattern.
export function NativeSection({
  label,
  children,
  className,
}: {
  label?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</h3>}
      <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-card dark:border-white/[0.08]">
        {children}
      </div>
    </div>
  )
}

interface NativeRowProps {
  icon?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  chevron?: boolean
  href?: string
  onClick?: () => void
  className?: string
}

export function NativeRow({ icon, title, subtitle, trailing, chevron, href, onClick, className }: NativeRowProps) {
  const interactive = Boolean(href || onClick)
  const content = (
    <>
      {icon}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{title}</div>
        {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {trailing}
      {chevron && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />}
    </>
  )
  const rowClass = cn(
    "flex w-full items-start gap-3 border-b border-black/[0.06] px-4 py-3 text-left last:border-b-0 dark:border-white/[0.08]",
    interactive && "transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.04]",
    className,
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
        {content}
      </a>
    )
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClass}>
        {content}
      </button>
    )
  }
  return <div className={rowClass}>{content}</div>
}
