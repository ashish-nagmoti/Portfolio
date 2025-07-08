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
