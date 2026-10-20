"use client"

import { useEffect, useState, type ComponentType } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { WifiHigh as Wifi, BatteryFull, MagnifyingGlass as Search, Sun, Moon, Command, Check, Copy, Robot as Bot } from "@phosphor-icons/react"
import { APPS } from "./app-registry"
import { ControlCenterGlyph } from "./control-center"
import type { AppId, OpenWindow } from "./types"
import { cn } from "@/lib/utils"

type MenuKey = "apple" | "file" | "edit" | "view" | "help" | "window" | null

interface MenuBarProps {
  focusedApp: AppId | null
  openWindows: OpenWindow[]
  onOpenApp: (id: AppId) => void
  onOpenSpotlight: () => void
  /** Full reboot: replays the boot screen, unlike the context menu's lighter "Refresh". */
  onRestart: () => void
  /** Puts every desktop widget back in its default slot. */
  onResetWidgets: () => void
  /** Replays the guided tour. */
  onStartTour: () => void
  /** Opens the wallpaper picker. */
  onChangeWallpaper: () => void
  onCloseFocused: () => void
  onDownloadResume: () => void
  onShowDesktop: () => void
  controlCenterOpen: boolean
  onToggleControlCenter: () => void
}

interface MenuItem {
  label: string
  action: () => void
  icon?: ComponentType<{ className?: string }>
  shortcut?: string
  disabled?: boolean
}

/** A menu row, or "-" for a separator line. */
type MenuEntry = MenuItem | "-"

/** Shared look for every pull-down and context menu on the desktop. */
export const MENU_PANEL =
  "rounded-[11px] border border-black/[0.08] bg-[#f4f4f4]/[0.93] p-[5px] text-[13px] shadow-[0_12px_36px_-6px_rgba(0,0,0,0.3),0_2px_6px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/[0.12] dark:bg-[#28282b]/[0.92] dark:shadow-[0_14px_40px_-4px_rgba(0,0,0,0.6)]"
export const MENU_ROW =
  "group flex h-[24px] w-full items-center gap-2 rounded-[5px] px-2.5 text-left text-foreground/90 hover:bg-primary hover:text-white disabled:pointer-events-none disabled:text-foreground/30"

function Dropdown({ items, disabledHint }: { items: MenuEntry[]; disabledHint?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.08 } }}
      transition={{ duration: 0.1 }}
      role="menu"
      className={cn("absolute left-0 top-full z-10 mt-[5px] min-w-[230px] font-normal", MENU_PANEL)}
    >
      {items.map((item, i) =>
        item === "-" ? (
          <div key={`sep-${i}`} className="mx-2.5 my-[5px] h-px bg-black/10 dark:bg-white/10" />
        ) : (
          <button key={item.label} role="menuitem" onClick={item.action} disabled={item.disabled} className={MENU_ROW}>
            {item.icon && <item.icon className="h-3.5 w-3.5 shrink-0 opacity-80" />}
            <span className="flex-1 truncate">{item.label}</span>
            {item.shortcut && (
              <span className="pl-6 text-foreground/40 group-hover:text-white/80 group-disabled:text-foreground/20">{item.shortcut}</span>
            )}
          </button>
        ),
      )}
      {disabledHint && <p className="px-2.5 py-1 text-foreground/35">{disabledHint}</p>}
    </motion.div>
  )
}

/** Informational rows (keyboard hints) that do nothing when chosen. */
const noop = () => {}

// Menu titles get a rounded highlight while their menu is open, as on macOS.
const BAR_BUTTON = "flex h-[22px] items-center rounded-[5px] px-2.5 text-foreground/90"
const BAR_BUTTON_OPEN = "bg-black/10 dark:bg-white/15"

export function MenuBar({
  focusedApp,
  openWindows,
  onOpenApp,
  onOpenSpotlight,
  onRestart,
  onResetWidgets,
  onStartTour,
  onChangeWallpaper,
  onCloseFocused,
  onDownloadResume,
  onShowDesktop,
  controlCenterOpen,
  onToggleControlCenter,
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

  // Esc dismisses an open menu (before the desktop treats it as "close window")
  useEffect(() => {
    if (!openMenu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      e.stopImmediatePropagation()
      setOpenMenu(null)
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [openMenu])

  // Like macOS: once one menu is open, moving across the bar opens the others.
  const hoverOpen = (key: MenuKey) => () => setOpenMenu((v) => (v && v !== key ? key : v))

  const menus: { key: MenuKey; label: string; items: MenuEntry[] }[] = [
    {
      key: "file",
      label: "File",
      items: [
        { label: "Spotlight Search…", shortcut: "⌘K", action: run(onOpenSpotlight) },
        "-",
        { label: "Download Resume", action: run(onDownloadResume) },
        { label: "Open llms.txt", action: run(() => window.open("/llms.txt", "_blank", "noopener")) },
        { label: "Open robots.txt", action: run(() => window.open("/robots.txt", "_blank", "noopener")) },
        "-",
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
        { label: "Change Wallpaper…", action: run(onChangeWallpaper) },
        "-",
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
        { label: "Take the Tour", action: run(onStartTour) },
        { label: "About This OS", action: run(() => onOpenApp("about")) },
        "-",
        { label: "Search", shortcut: "⌘K", action: noop },
        { label: "Close Focused Window", shortcut: "Esc", action: noop },
        { label: "Switch Windows", shortcut: "⌘Tab", action: noop },
        { label: "Desktop Menu", shortcut: "Right-click", action: noop },
      ],
    },
  ]

  return (
    <div
      data-tour="menubar"
      className="fixed inset-x-0 top-0 z-[9800] flex h-8 select-none items-center justify-between bg-white/45 px-2.5 text-[13px] font-medium shadow-[0_0.5px_0_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150 dark:bg-black/30 dark:shadow-[0_0.5px_0_rgba(255,255,255,0.06)]"
    >
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => toggle("apple")}
            onMouseEnter={hoverOpen("apple")}
            aria-label="System menu"
            className={cn(BAR_BUTTON, openMenu === "apple" && BAR_BUTTON_OPEN)}
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
                    "-",
                    { label: "Reset Widget Layout", action: run(onResetWidgets) },
                    "-",
                    { label: "Restart Desktop…", action: run(onRestart) },
                  ]}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        <span className="px-2.5 font-bold">{appTitle}</span>

        <div className="hidden items-center sm:flex">
          {menus.map((menu) => (
            <div key={menu.key} className="relative">
              <button
                onClick={() => toggle(menu.key)}
                onMouseEnter={hoverOpen(menu.key)}
                className={cn(BAR_BUTTON, openMenu === menu.key && BAR_BUTTON_OPEN)}
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
              onMouseEnter={hoverOpen("window")}
              className={cn(BAR_BUTTON, openMenu === "window" && BAR_BUTTON_OPEN)}
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

      <div className="flex items-center gap-3.5 pr-1 text-foreground/85">
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
        {/* Plain-text version of the site for AI agents (llmstxt.org) */}
        <a
          href="/llms.txt"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View llms.txt, a plain-text version of this site for AI agents"
          title="llms.txt — for AI agents"
          className="hover:text-foreground transition-colors"
        >
          <Bot className="h-3.5 w-3.5" />
        </a>
        <button data-tour="spotlight" onClick={onOpenSpotlight} aria-label="Search" className="hover:text-foreground transition-colors">
          <Search className="h-3.5 w-3.5" />
        </button>
        <button
          data-tour="control-center"
          onClick={() => {
            closeMenus()
            onToggleControlCenter()
          }}
          aria-label="Control Center"
          aria-expanded={controlCenterOpen}
          className={cn(
            "-mx-1.5 flex h-[22px] items-center rounded-[5px] px-1.5 transition-colors hover:text-foreground",
            controlCenterOpen && "bg-black/10 text-foreground dark:bg-white/15",
          )}
        >
          <ControlCenterGlyph className="h-[15px] w-[15px]" />
        </button>
        {time && <span className="tabular-nums">{time}</span>}
      </div>
    </div>
  )
}
