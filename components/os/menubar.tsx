"use client"

import { useEffect, useState, type ComponentType } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Wifi, BatteryFull, Search, Sun, Moon, Command, Check, Copy } from "lucide-react"
import { APPS } from "./app-registry"
import type { AppId, OpenWindow } from "./types"
import { cn } from "@/lib/utils"

type MenuKey = "apple" | "file" | "edit" | "view" | "help" | "window" | null

interface MenuBarProps {
  focusedApp: AppId | null
  openWindows: OpenWindow[]
  onOpenApp: (id: AppId) => void
  onOpenSpotlight: () => void
  onRefresh: () => void
  onCloseFocused: () => void
  onDownloadResume: () => void
  onShowDesktop: () => void
}

interface MenuItem {
  label: string
  action: () => void
  icon?: ComponentType<{ className?: string }>
  shortcut?: string
  disabled?: boolean
}

function Dropdown({ items, disabledHint }: { items: MenuItem[]; disabledHint?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.12 }}
      className="absolute top-full left-0 mt-1.5 w-60 rounded-xl bg-white/90 dark:bg-[#2a2a30]/95 backdrop-blur-xl shadow-2xl border border-black/5 dark:border-white/10 py-1.5 z-10"
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          disabled={item.disabled}
          className="flex w-full items-center gap-2.5 px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors text-left disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
        >
          {item.icon && <item.icon className="h-3.5 w-3.5 shrink-0" />}
          <span className="flex-1">{item.label}</span>
          {item.shortcut && <span className="text-xs opacity-50">{item.shortcut}</span>}
        </button>
      ))}
      {disabledHint && <p className="px-3 py-1.5 text-xs opacity-40">{disabledHint}</p>}
    </motion.div>
  )
}

export function MenuBar({
  focusedApp,
  openWindows,
  onOpenApp,
  onOpenSpotlight,
  onRefresh,
  onCloseFocused,
  onDownloadResume,
  onShowDesktop,
}: MenuBarProps) {
  const { theme, setTheme } = useTheme()
  const [time, setTime] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<MenuKey>(null)
  const [emailCopied, setEmailCopied] = useState(false)

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
    update()
    const interval = setInterval(update, 15000)
    return () => clearInterval(interval)
  }, [])

  const appTitle = focusedApp ? APPS[focusedApp].title : "Finder"
  const closeMenus = () => setOpenMenu(null)
  const toggle = (key: MenuKey) => setOpenMenu((v) => (v === key ? null : key))
  const run = (fn: () => void) => () => {
    fn()
    closeMenus()
  }

  const copyEmail = () => {
    navigator.clipboard?.writeText("ashishnagmoti2310@gmail.com").then(() => {
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 1500)
    })
  }

  const menus: { key: MenuKey; label: string; items: MenuItem[] }[] = [
    {
      key: "file",
      label: "File",
      items: [
        { label: "Spotlight Search…", shortcut: "⌘K", action: run(onOpenSpotlight) },
        { label: "Download Resume", action: run(onDownloadResume) },
        { label: "Close Window", shortcut: "Esc", action: run(onCloseFocused), disabled: !focusedApp },
      ],
    },
    {
      key: "edit",
      label: "Edit",
      items: [
        {
          label: emailCopied ? "Copied!" : "Copy Email Address",
          icon: emailCopied ? Check : Copy,
          action: () => copyEmail(),
        },
      ],
    },
    {
      key: "view",
      label: "View",
      items: [
        { label: "Show Desktop", action: run(onShowDesktop) },
        {
          label: theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode",
          icon: theme === "light" ? Moon : Sun,
          action: run(() => setTheme(theme === "light" ? "dark" : "light")),
        },
      ],
    },
    {
      key: "help",
      label: "Help",
      items: [
        { label: "About This OS", action: run(() => onOpenApp("about")) },
        { label: "⌘K — Search", action: () => {} },
        { label: "Esc — Close focused window", action: () => {} },
        { label: "⌘Tab — Switch windows", action: () => {} },
        { label: "Right-click — Desktop menu", action: () => {} },
      ],
    },
  ]

  return (
    <div className="fixed top-0 inset-x-0 z-[9800] h-8 flex items-center justify-between px-3 bg-white/70 dark:bg-black/40 backdrop-blur-xl border-b border-black/5 dark:border-white/10 text-[13px] font-medium select-none">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => toggle("apple")}
            className={cn("flex items-center px-2 h-6 rounded", openMenu === "apple" ? "bg-primary/20" : "hover:bg-black/5 dark:hover:bg-white/10")}
          >
            <Command className="h-3.5 w-3.5" />
          </button>
          <AnimatePresence>
            {openMenu === "apple" && (
              <>
                <div className="fixed inset-0 z-0" onClick={closeMenus} />
                <Dropdown
                  items={[
                    { label: "About This OS", action: run(() => onOpenApp("about")) },
                    { label: "System Settings…", action: run(() => setTheme(theme === "light" ? "dark" : "light")) },
                    { label: "Restart Desktop", action: run(onRefresh) },
                  ]}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        <span className="font-bold">{appTitle}</span>

        <div className="hidden sm:flex items-center gap-4 text-foreground/70">
          {menus.map((menu) => (
            <div key={menu.key} className="relative">
              <button
                onClick={() => toggle(menu.key)}
                className={cn("hover:text-foreground transition-colors", openMenu === menu.key && "text-foreground")}
              >
                {menu.label}
              </button>
              <AnimatePresence>
                {openMenu === menu.key && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={closeMenus} />
                    <Dropdown items={menu.items} />
                  </>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="relative">
            <button
              onClick={() => toggle("window")}
              className={cn("hover:text-foreground transition-colors", openMenu === "window" && "text-foreground")}
            >
              Window
            </button>
            <AnimatePresence>
              {openMenu === "window" && (
                <>
                  <div className="fixed inset-0 z-0" onClick={closeMenus} />
                  <Dropdown
                    items={
                      openWindows.length === 0
                        ? []
                        : openWindows.map((w) => ({
                            label: APPS[w.id].title,
                            action: run(() => onOpenApp(w.id)),
                          }))
                    }
                    disabledHint={openWindows.length === 0 ? "No open windows" : undefined}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3.5 text-foreground/80">
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
        <button onClick={onOpenSpotlight} aria-label="Search" className="hover:text-foreground transition-colors">
          <Search className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
          className="hover:text-foreground transition-colors"
        >
          {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </button>
        {time && <span className="tabular-nums">{time}</span>}
      </div>
    </div>
  )
}
