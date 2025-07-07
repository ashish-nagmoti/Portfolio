"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

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

  neofetch: `                   -\`                    user@ai-engineer
                  .o+\`                   -----------------
                 \`ooo/                   OS: Backend Engineer
                \`+oooo:                  Host: Cloud Native
               \`+oooooo:                 Kernel: Python 3.11
               -+oooooo+:                Uptime: 4 years
             \`/:-:++oooo+:               Packages: Django, FastAPI
            \`/++++/+++++++:              Shell: zsh
           \`/++++++++++++++:             Resolution: Full Stack
          \`/+++ooooooooooooo/\`           DE: VS Code
         ./ooosssso++osssssso+\`          WM: Tmux
        .oossssso-\`\`\`\`/ossssss+\`         Theme: Dark Mode
       -osssssso.      :ssssssso.        Icons: Lucide
      :osssssss/        osssso+++.       Terminal: Interactive
     /ossssssss/        +ssssooo/-       CPU: Problem Solving
   \`/ossssso+/:-        -:/+osssso+-     GPU: Machine Learning
  \`+sso+:-\`                 \`.-/+oso:    Memory: Always Learning
 \`++:.                           \`-/+/   Storage: Cloud First
 .\`                                 \`/`,

  about: `👨‍💻 AI Engineering Student & Backend Developer

🎓 Education: AI Engineering Student
🏢 Experience: Backend-focused with 4+ years
🌟 Specialties: API Development, Cloud Architecture, AI Systems

🏆 Leadership:
  • Phoenix Club - Vice President
  • Young Indians - Innovation Head

💼 Professional:
  • AWS Client Projects
  • Freelance Development
  • Cloud Solutions Architecture

💻 Coding Profiles:
  • LeetCode: 500+ Problems Solved
  • GitHub: 50+ Repositories`,

  skills: `🛠️ Technical Stack:

Backend Development:
  ├── Python (Expert)
  ├── Django (Advanced)
  ├── FastAPI (Advanced)
  └── REST APIs (Expert)

Cloud Platforms:
  ├── AWS (Advanced)
  ├── GCP (Intermediate)
  └── Cloud Architecture (Advanced)

Databases:
  ├── PostgreSQL
  ├── MongoDB
  └── Redis

DevOps & Tools:
  ├── Docker
  ├── CI/CD
  ├── Git
  └── Linux

AI/ML:
  ├── LLM Integration
  ├── API Automation
  └── Data Processing`,

  projects: `🚀 Recent Projects:

1. API Testing Automation Tool
   ├── AI-powered Swagger analysis
   ├── Automated test generation
   └── Tech: Python, FastAPI, OpenAI

2. EC2 Spot Instance Orchestrator
   ├── Cost optimization system
   ├── Auto-scaling management
   └── Tech: AWS, Python, Boto3

3. Email-to-JSON LLM Query Bot
   ├── Email processing automation
   ├── Structured data extraction
   └── Tech: Python, LLM APIs

4. Mental Health Static Site
   ├── Interactive animations
   ├── Performance optimized
   └── Tech: HTML, CSS, GSAP

5. Radius Flutter App
   ├── Social networking features
   ├── Real-time events
   └── Tech: Flutter, Firebase`,

  contact: `📫 Get In Touch:

📧 Email: your.email@example.com
🔗 LinkedIn: linkedin.com/in/your-profile
🐙 GitHub: github.com/your-username
🌐 Portfolio: your-portfolio.com
📱 Twitter: @your_twitter_handle

💼 Available for:
  • Backend Development Projects
  • Cloud Architecture Consulting
  • AI/ML Integration
  • Technical Leadership
  • Freelance & Contract Work

📍 Location: Your City, Country
🕒 Timezone: UTC+5:30 (IST)
💬 Preferred Contact: Email or LinkedIn

📋 Services Offered:
  • Python/Django/FastAPI Development
  • AWS Cloud Solutions & Migration
  • API Design & Development
  • System Architecture Consulting
  • Code Reviews & Technical Mentoring`,

  whoami: "ai-engineer",

  clear: "CLEAR_TERMINAL",

  interests: `📚 Recent Interests & Bookmarks:

🔗 Latest Additions:
  ├── Building Microservices with Python and Docker
  ├── AWS re:Invent 2023 - Serverless at Scale  
  ├── The State of AI in 2024: LLMs and Beyond
  └── System Design Interview: Design a Chat System

📊 Content Types:
  ├── Blog Posts (Technical Articles)
  ├── YouTube Videos (Tutorials & Talks)
  ├── Articles (Industry Analysis)
  └── Resources (Tools & References)

💡 Categories I Follow:
  ├── Python & Backend Development
  ├── Cloud Architecture & AWS
  ├── AI/ML & LLM Integration
  ├── System Design & Scalability
  └── DevOps & Best Practices

Type 'interests' in terminal or visit /interests page to see the full curated list!`,
}

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Welcome to AI Engineer Terminal v1.0.0" },
    { type: "output", content: 'Type "help" to see available commands.' },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    setLines((prev) => [...prev, { type: "command", content: `$ ${cmd}` }])

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
        }, 500)
      }
    } else {
      setLines((prev) => [
        ...prev,
        {
          type: "error",
          content: `Command not found: ${trimmedCmd}. Type "help" for available commands.`,
        },
      ])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentCommand.trim() && !isTyping) {
      executeCommand(currentCommand)
      setCurrentCommand("")
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black/90 text-green-400 font-mono text-sm">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400">terminal</span>
      </div>

      <div ref={terminalRef} className="p-4 h-96 overflow-y-auto" onClick={() => inputRef.current?.focus()}>
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`mb-1 ${
              line.type === "command" ? "text-blue-400" : line.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            <pre className="whitespace-pre-wrap font-mono">{line.content}</pre>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400">
            <span className="animate-pulse">Processing...</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-blue-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className="flex-1 bg-transparent outline-none text-green-400"
            placeholder="Type a command..."
            disabled={isTyping}
            autoFocus
          />
        </form>
      </div>
    </Card>
  )
}
