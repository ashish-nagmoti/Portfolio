"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from "react"
import { motion } from "framer-motion"
import {
  HelpCircle,
  Cpu,
  User,
  Code2,
  FolderGit2,
  Mail,
  UserCircle2,
  Eraser,
  AlertCircle,
  type LucideIcon,
} from "lucide-react"

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
}

const commands = {
  help: `Available commands:
  help        - Show this help message
  neofetch    - Display system information
  about       - Show personal information
  skills      - List technical skills
  projects    - List recent projects
  interests   - Show personal interests & hobbies
  contact     - Show contact information
  clear       - Clear terminal
  whoami      - Display current user`,

  neofetch: `                   -\`                    user@ashish-nagmoti
                  .o+\`                   -----------------
                 \`ooo/                   OS: Arch Linux
                \`+oooo:                  Host: Backend Developer
               \`+oooooo:                 Packages: Django, FastAPI, AWS
               -+oooooo+:                 Resolution: Full Stack
             \`/:-:++oooo+:               DE: Hyprland
            \`/++++/+++++++:              IDE: VSCODE and Nvchad
           \`/++++++++++++++:             WM: wayland
          \`/+++ooooooooooooo/\`          Theme: Dark Mode
         ./ooosssso++osssssso+\`          CPU: Problem Solving
        .oossssso-\`\`\`\`/ossssss+\`     Storage: Cloud First
       -osssssso.      :ssssssso.         Icons: Lucide
      :osssssss/        osssso+++.        Terminal: Interactive
     /ossssssss/        +ssssooo/-        Memory: Always Learning
   \`/ossssso+/:-        -:/+osssso+-     GPU: Machine Learning
  \`+sso+:-\`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \`/`,

  about: `👨‍💻 Ashish Nagmoti
AI Engineering Student & Backend Developer

🎓 Education: K.K. Wagh Institute of Engineering Education and Research (9.1 CGPA, Expected 2026)
🏢 Experience: Backend-focused, 4+ years
🌟 Specialties: API Development, Cloud Architecture, AI Systems

🏆 Leadership:
  • Phoenix Club - Vice President
  • Young Indians Nashik Chapter - Innovation Coordinator

💼 Professional:
  • AWS Client Projects
  • Freelance Development
  • Cloud Solutions Architecture

💻 Coding Profiles:
  • LeetCode: https://leetcode.com/u/ashish_nagmoti/ (100+ Problems Solved)
  • GitHub: https://github.com/ashish-nagmoti (50+ Repositories`,

  skills: `🛠️ Technical Stack:

Backend Development:
  • Python
  • Django
  • FastAPI
  • REST APIs

Cloud Platforms:
  • AWS
  • GCP
  • Cloud Architecture

Databases:
  • PostgreSQL
  • MongoDB
  • S3

DevOps & Tools:
  • Docker
  • CI/CD
  • Git
  • Linux

AI/ML:
  • LLM Integration
  • Gemini API
  • Langchain
  • Vector Databases`,

  projects: `🚀 Recent Projects:

1. StoryMail – AI-Powered Smart Email Platform
   • Mar 2024 – Oct 2024
   • Tech: Django, Auth0, Postgres SQL, GeminiAPI
   • AI platform for email classification, weekly digests, and querying.
   • Demo: http://story-mail-olive.vercel.app/
   • GitHub: https://github.com/ashish-nagmoti/storymail

2. KalaShala – Platform Empowering Local Artists
   • Feb 2024 – Mar 2024
   • Tech: Django, AWS, Postgres SQL
   • Role: Backend Development and Deployment
   • Platform for local artists to showcase, publish content, and grow.
   • Demo: https://kalashala-frontend1-zxra.vercel.app/
   • GitHub: https://github.com/ashish-nagmoti/kalashala-backend

3. AceUp – Student Resource Hub with AI Chatbot
   • 2024
   • Tech: Django, Tailwind CSS, Jinja, SQLite3, Python
   • Student hub with notes, roadmaps, events, and chatbot.
   • Demo: https://inevitable-lucky-predeator-b19e8de5.koyeb.app/
   • GitHub: https://github.com/riaan-attar/AceUp`,

  contact: `📫 Get In Touch:

📧 Email: ashishnagmoti2310@gmail.com
🔗 LinkedIn: linkedin.com/in/ashish-nagmoti-54269b249
🐙 GitHub: github.com/ashish-nagmoti
🌐 Medium: medium.com/@ashishnagmoti7

💼 Available for:
  • Backend Development Projects
  • Cloud Architecture Consulting
  • AI/ML Integration
  • Technical Leadership
  • Freelance & Contract Work

📍 Location: Nashik, India
🕒 Timezone: UTC+5:30 (IST)
💬 Preferred Contact: Email or LinkedIn

📋 Services Offered:
  • Python/Django/FastAPI Development
  • AWS Cloud Solutions & Migration
  • API Design & Development`,

  whoami: "ashish-nagmoti",

  clear: "CLEAR_TERMINAL",

  interests: `📚 Recent Interests & Bookmarks:

🔗 Latest Additions:
  • Building Microservices with Python and Docker
  • AWS re:Invent 2023 - Serverless at Scale
  • The State of AI in 2024: LLMs and Beyond
  • System Design Interview: Design a Chat System

📊 Content Types:
  • Blog Posts (Technical Articles)
  • YouTube Videos (Tutorials & Talks)
  • Articles (Industry Analysis)
  • Resources (Tools & References)

💡 Categories I Follow:
  • Python & Backend Development
  • Cloud Architecture & AWS
  • AI/ML & LLM Integration
  • System Design & Scalability
  • DevOps & Best Practices

Type 'interests' in terminal or visit /interests page to see the full curated list!`,
}

const QUICK_COMMANDS: { cmd: string; label: string; icon: LucideIcon; className: string }[] = [
  { cmd: "help", label: "help", icon: HelpCircle, className: "bg-white/10 text-slate-200" },
  { cmd: "neofetch", label: "neofetch", icon: Cpu, className: "bg-emerald-400/15 text-emerald-300" },
  { cmd: "about", label: "about", icon: User, className: "bg-violet-400/15 text-violet-300" },
  { cmd: "skills", label: "skills", icon: Code2, className: "bg-sky-400/15 text-sky-300" },
  { cmd: "projects", label: "projects", icon: FolderGit2, className: "bg-sky-400/15 text-sky-300" },
  { cmd: "contact", label: "contact", icon: Mail, className: "bg-pink-400/15 text-pink-300" },
  { cmd: "whoami", label: "whoami", icon: UserCircle2, className: "bg-amber-400/15 text-amber-300" },
  { cmd: "clear", label: "clear", icon: Eraser, className: "bg-rose-400/15 text-rose-300" },
]

function PromptTag() {
  return (
    <span className="select-none whitespace-nowrap">
      <span className="text-emerald-400">ashish</span>
      <span className="text-slate-500">@</span>
      <span className="text-sky-400">portfolio</span>
      <span className="text-slate-500 mx-1">~</span>
      <span className="text-violet-400">$</span>
    </span>
  )
}

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Welcome to Ashish's interactive terminal — v1.0.0" },
    { type: "output", content: 'Type "help" or tap a command below to get started.' },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines, isTyping])

  useEffect(() => {
    // Auto-focusing on mobile pops the on-screen keyboard the instant the app
    // opens, covering half the screen before the user asked for it — so only
    // steal focus on pointer-driven (desktop-width) sessions.
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      inputRef.current?.focus()
    }
  }, [])

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    if (!trimmedCmd) return

    setLines((prev) => [...prev, { type: "command", content: cmd }])

    if (trimmedCmd === "clear") {
      setLines([])
      return
    }

    const output = commands[trimmedCmd as keyof typeof commands]

    if (output) {
      if (output === "CLEAR_TERMINAL") {
        setLines([])
      } else {
        setIsTyping(true)
        setTimeout(() => {
          setLines((prev) => [...prev, { type: "output", content: output }])
          setIsTyping(false)
        }, 400)
      }
    } else {
      setLines((prev) => [
        ...prev,
        { type: "error", content: `Command not found: ${trimmedCmd}. Type "help" for available commands.` },
      ])
    }
  }, [])

  const runCommand = (cmd: string) => {
    if (isTyping || !cmd.trim()) return
    setHistory((prev) => (prev[prev.length - 1] === cmd ? prev : [...prev, cmd]))
    setHistoryIndex(null)
    executeCommand(cmd)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runCommand(currentCommand)
    setCurrentCommand("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      const idx = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(idx)
      setCurrentCommand(history[idx])
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex === null) return
      const idx = historyIndex + 1
      if (idx >= history.length) {
        setHistoryIndex(null)
        setCurrentCommand("")
      } else {
        setHistoryIndex(idx)
        setCurrentCommand(history[idx])
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      const q = currentCommand.trim().toLowerCase()
      if (!q) return
      const match = Object.keys(commands).find((c) => c.startsWith(q))
      if (match) setCurrentCommand(match)
    }
  }

  return (
    <div className="relative h-full bg-gradient-to-b from-[#0e0c16] to-[#181622] text-slate-200 font-mono text-[13px] sm:text-sm overflow-hidden flex flex-col">
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-violet-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-emerald-500/10 blur-[80px]" />

      <div
        ref={terminalRef}
        className="terminal-scroll relative z-10 flex-1 overflow-y-auto p-4"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="font-semibold bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
            Welcome to Ashish&apos;s Terminal
          </p>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">Type a command, or tap one below to explore.</p>
        </div>

        {lines.map((line, index) => {
          if (line.type === "command") {
            return (
              <div key={index} className="mt-3 mb-1 flex items-start gap-2">
                <PromptTag />
                <span className="break-all text-slate-100">{line.content}</span>
              </div>
            )
          }

          const isNeofetch = line.content === commands.neofetch

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`mb-2 ${line.type === "error" ? "flex items-start gap-1.5 text-rose-400" : "text-slate-300"}`}
            >
              {line.type === "error" && <AlertCircle className="h-3.5 w-3.5 shrink-0 translate-y-0.5" />}
              {isNeofetch ? (
                <pre className="-mx-1 overflow-x-auto whitespace-pre px-1 text-[9px] leading-[1.15] text-emerald-300 sm:text-xs">
                  {line.content}
                </pre>
              ) : (
                <pre className="whitespace-pre-wrap font-mono leading-relaxed">{line.content}</pre>
              )}
            </motion.div>
          )
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 py-1 text-slate-500">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
          <PromptTag />
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-slate-100 caret-emerald-400 outline-none placeholder:text-slate-600"
            placeholder="Type a command…"
            disabled={isTyping}
          />
        </form>
      </div>

      <div className="no-scrollbar relative z-10 shrink-0 overflow-x-auto border-t border-white/10 bg-black/20 px-3 py-2.5 backdrop-blur-sm">
        <div className="flex w-max items-center gap-2">
          {QUICK_COMMANDS.map(({ cmd, label, icon: Icon, className }) => (
            <button
              key={cmd}
              type="button"
              onClick={() => runCommand(cmd)}
              disabled={isTyping}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-transform active:scale-95 disabled:opacity-40 ${className}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
