"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { IconBadge } from "@/components/os/icon-badge"
import { NativeSection, NativeRow } from "@/components/os/native-list"
import { cn } from "@/lib/utils"
import { Code, Code2, Cloud, Database, Users, Award, Briefcase, Building2, History, LayoutTemplate, Cpu, Brain } from "lucide-react"

const skills = {
  llm: ["LLM Inference", "vLLM", "KServe", "Hugging Face", "RAG", "Vector Search", "AI Agents", "LLM Routing"],
  infra: ["Kubernetes", "NVIDIA GPUs", "CUDA", "Kubeflow", "Model Registries", "ML Pipelines", "AI Observability"],
  backend: ["Python", "FastAPI", "Django", "REST APIs"],
  frontend: ["React", "Next.js", "TypeScript"],
  cloud: ["AWS", "GCP", "Docker", "Linux"],
  databases: ["PostgreSQL", "MongoDB", "Qdrant"],
}

const SKILL_META = {
  llm: { icon: Brain, gradient: "from-fuchsia-400 to-pink-600", label: "Generative AI & LLMs" },
  infra: { icon: Cpu, gradient: "from-amber-400 to-orange-600", label: "AI Infrastructure" },
  backend: { icon: Code, gradient: "from-violet-400 to-indigo-600", label: "Backend" },
  frontend: { icon: LayoutTemplate, gradient: "from-cyan-400 to-teal-600", label: "Frontend" },
  cloud: { icon: Cloud, gradient: "from-sky-400 to-blue-600", label: "Cloud" },
  databases: { icon: Database, gradient: "from-emerald-400 to-green-600", label: "Databases" },
} as const

const codingProfiles = [
  {
    platform: "LeetCode",
    username: "ashish_nagmoti",
    url: "https://leetcode.com/u/ashish_nagmoti/",
    stats: "100+ Problems Solved",
    description: "Regular practice in algorithms and data structures",
    gradient: "from-orange-400 to-amber-600",
  },
  {
    platform: "GitHub",
    username: "ashish-nagmoti",
    url: "https://github.com/ashish-nagmoti",
    stats: "45+ Repositories",
    description: "Open source contributions and personal projects",
    gradient: "from-zinc-700 to-zinc-900",
  },
]

const leadership = [
  {
    org: "Phoenix Club",
    role: "Vice President",
    description: "Leading technical initiatives and organizing tech events for 200+ members.",
  },
  {
    org: "Innovera Hackathon",
    role: "Web and IT Head",
    description: "Managed a team of 10+ people for building the website and running technical aspects of the hackathon.",
  },
  {
    org: "Young Indians Nashik Chapter",
    role: "Student Coordinator (Innovation)",
    description: "Driving innovation projects and mentoring emerging entrepreneurs.",
  },
]

const sideProjects = [
  {
    name: "SovereignRAG – Decentralized Enterprise AI",
    date: "ESDS Swaraj CloudForge Hackathon 2026",
    detail:
      "Tech: Python, FastAPI, PostgreSQL, Qdrant, Ed25519, vLLM, React. Decentralized RAG where sensitive data stays at its source; nodes exchange signed claims under locally enforced policy instead of moving documents.",
  },
  {
    name: "System Map – Isometric Codebase Visualizer",
    date: "Aug 2026",
    detail: "Tech: Claude Code, HTML, SVG, JavaScript. Renders a codebase's real routes, functions, models and tables as an interactive isometric blueprint.",
  },
  {
    name: "StoryMail – AI-Powered Smart Email Platform",
    date: "Mar 2024 – Oct 2024",
    detail: "Tech: Django, Auth0, Postgres SQL, GeminiAPI. AI platform for email classification, weekly digests, and querying.",
  },
  {
    name: "KalaShala – Platform Empowering Local Artists",
    date: "Feb 2024 – Mar 2024",
    detail: "Role: Backend Development and Deployment. Platform for local artists to showcase, publish content, and grow.",
  },
  {
    name: "AceUp – Student Resource Hub with AI Chatbot",
    date: undefined,
    detail: "Tech: Django, Tailwind CSS, Jinja, SQLite3, Python. Student hub with notes, roadmaps, events, and chatbot.",
  },
]

const achievements = [
  { title: "Codethon – Arambh", place: "Winner (1st place)", description: "Coding competition winner for innovative solutions." },
  { title: "Code-O-Fiesta 2.0", place: "3rd Place", description: "Placed 3rd in a competitive coding event." },
  { title: "Social Winter of Code", place: "Contributor", description: "Completed open-source contributions under SWOC." },
]

const experience = [
  {
    role: "AI Engineer & Researcher",
    company: "ESDS Software Solution Ltd.",
    dates: "Present",
    description:
      "AI infrastructure and enterprise AI platforms: LLM inference and model serving, GPU infrastructure, Kubernetes-based AI workloads, RAG, AI agents and AgentOps, AI security and governance, sovereign AI architectures.",
  },
  {
    role: "Backend Intern",
    company: "PrimeAcademy — Remote",
    dates: "Mar 2025 – Aug 2025",
    description: "Worked on backend using Django and AWS deployment.",
  },
  {
    role: "Technical Intern",
    company: "Lead Cured — Remote",
    dates: "Sep 2024 – Nov 2024",
    description: "Built and tested serverless APIs using AWS Lambda, EC2, S3, IAM.",
  },
]

/**
 * The overview, told the way macOS's Versions browser tells a file's story:
 * newest snapshot on top marked Current, each one a changelog of what that
 * stage added. Built from the same facts as the other sections.
 */
const HISTORY = [
  {
    version: "v3.0",
    when: "Present",
    current: true,
    title: "AI Engineer & Researcher",
    org: "ESDS Software Solution Ltd.",
    changes: [
      "LLM inference and model serving on GPU infrastructure",
      "Kubernetes AI workloads, RAG, AI agents and AgentOps",
      "Sovereign AI research — SovereignRAG, CloudForge Hackathon 2026",
    ],
  },
  {
    version: "v2.1",
    when: "Mar – Aug 2025",
    title: "Backend Intern",
    org: "PrimeAcademy · Remote",
    changes: ["Django backend with AWS deployment"],
  },
  {
    version: "v2.0",
    when: "Sep – Nov 2024",
    title: "Technical Intern",
    org: "Lead Cured · Remote",
    changes: ["Serverless APIs on AWS Lambda, EC2, S3 and IAM"],
  },
  {
    version: "v1.5",
    when: "2024",
    title: "Side projects, freelance, leadership",
    org: "StoryMail · KalaShala · AceUp",
    changes: [
      "Shipped an AI email platform, an artists' platform and a student hub",
      "AWS cloud work for 3+ freelance clients",
      "Vice President, Phoenix Club · Web & IT Head, Innovera Hackathon",
    ],
  },
  {
    version: "v1.0",
    when: "Class of 2026",
    title: "B.Tech, Artificial Intelligence & Data Science",
    org: "K.K. Wagh Institute of Engineering Education and Research · 9.1 CGPA",
    changes: ["Winner, Codethon – Arambh · 3rd place, Code-O-Fiesta 2.0", "Contributor, Social Winter of Code"],
  },
]

// A single accent runs through everything that's just "more of the same"
// content about one person (leadership, side projects, achievements,
// experience) — real macOS apps reserve color variation for things with an
// actual distinct identity (a brand, a tech domain), not for repeated rows
// of the same category.
const PROFILE_ACCENT = "from-violet-400 to-indigo-600"

const SECTIONS = [
  { id: "stats", label: "Overview", icon: History },
  { id: "profiles", label: "Coding Profiles", icon: Code2 },
  { id: "skills", label: "Skills", icon: Database },
  { id: "leadership", label: "Leadership", icon: Users },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "experience", label: "Experience", icon: Building2 },
] as const

type SectionId = (typeof SECTIONS)[number]["id"]

export function AboutApp() {
  const [active, setActive] = useState<SectionId>("stats")

  return (
    <div className="flex h-full">
      {/* Sidebar, Contacts.app / System Settings style */}
      <div className="flex w-[210px] shrink-0 flex-col border-r border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center gap-3 border-b border-black/[0.06] p-4 dark:border-white/[0.08]">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b text-sm font-semibold text-white shadow-md",
              PROFILE_ACCENT,
            )}
          >
            AN
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Ashish Nagmoti</p>
            <p className="truncate text-xs text-muted-foreground">AI Engineer &amp; Researcher</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {SECTIONS.map((section) => {
            const isActive = active === section.id
            return (
              <button
                key={section.id}
                onClick={() => setActive(section.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground/80 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                )}
              >
                <section.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {section.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Detail pane */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="p-6"
          >
            {active === "stats" && (
              <div className="space-y-6">
                <div>
                  <p className="text-base font-semibold leading-snug text-foreground">
                    AI Engineer &amp; Researcher at ESDS — LLM inference, GPU infrastructure, RAG and sovereign AI.
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    The interesting problems start after the model runs: operating it reliably, securely and at
                    enterprise scale.
                  </p>
                </div>

                {/* Version history, Versions-browser style: newest on top, marked Current */}
                <div>
                  <div className="mb-3 flex items-baseline justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Version History</p>
                    <p className="text-[11px] tabular-nums text-muted-foreground">{HISTORY.length} versions</p>
                  </div>
                  <ol className="relative ml-2 border-l border-black/10 dark:border-white/15">
                    {HISTORY.map((v) => (
                      <li key={v.version} className="relative pb-6 pl-6 last:pb-0">
                        {/* Rail marker; the current version gets a filled, glowing dot */}
                        <span
                          className={cn(
                            "absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border-2",
                            v.current
                              ? "border-primary bg-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]"
                              : "border-black/25 bg-background dark:border-white/30",
                          )}
                        />
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="rounded-md bg-black/[0.06] px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground/80 dark:bg-white/10">
                            {v.version}
                          </span>
                          {v.current && (
                            <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                              Current
                            </span>
                          )}
                          <span className="text-[11px] tabular-nums text-muted-foreground">{v.when}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold leading-snug text-foreground">{v.title}</p>
                        <p className="text-xs text-muted-foreground">{v.org}</p>
                        <ul className="mt-1.5 space-y-0.5">
                          {v.changes.map((c) => (
                            <li key={c} className="flex gap-2 text-xs leading-snug text-foreground/80">
                              <span className="select-none font-mono text-emerald-600 dark:text-emerald-400">+</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {active === "profiles" && (
              <NativeSection label="Coding Profiles">
                {codingProfiles.map((profile) => (
                  <NativeRow
                    key={profile.platform}
                    icon={<IconBadge icon={Code} gradient={profile.gradient} size="md" />}
                    title={profile.platform}
                    subtitle={
                      <>
                        @{profile.username}
                        <p className="mt-0.5">{profile.description}</p>
                      </>
                    }
                    trailing={
                      <Badge variant="secondary" className="shrink-0">
                        {profile.stats}
                      </Badge>
                    }
                    href={profile.url}
                  />
                ))}
              </NativeSection>
            )}

            {active === "skills" && (
              <NativeSection label="Technical Skills">
                {Object.entries(skills).map(([category, skillList]) => {
                  const meta = SKILL_META[category as keyof typeof SKILL_META]
                  return (
                    <NativeRow
                      key={category}
                      icon={<IconBadge icon={meta.icon} gradient={meta.gradient} size="md" />}
                      title={meta.label}
                      subtitle={
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {skillList.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      }
                    />
                  )
                })}
              </NativeSection>
            )}

            {active === "leadership" && (
              <NativeSection label="Leadership">
                {leadership.map((item) => (
                  <NativeRow
                    key={item.org}
                    icon={<IconBadge icon={Users} gradient={PROFILE_ACCENT} size="md" />}
                    title={item.org}
                    subtitle={
                      <>
                        <span className="font-medium text-foreground/80">{item.role}</span>
                        <p className="mt-0.5">{item.description}</p>
                      </>
                    }
                  />
                ))}
              </NativeSection>
            )}

            {active === "projects" && (
              <NativeSection label="Personal Projects">
                {sideProjects.map((p) => (
                  <NativeRow
                    key={p.name}
                    icon={<IconBadge icon={Briefcase} gradient={PROFILE_ACCENT} size="md" />}
                    title={p.name}
                    subtitle={
                      <>
                        {p.date && <span className="font-medium text-foreground/80">{p.date}</span>}
                        <p className="mt-0.5">{p.detail}</p>
                      </>
                    }
                  />
                ))}
              </NativeSection>
            )}

            {active === "achievements" && (
              <NativeSection label="Achievements">
                {achievements.map((a) => (
                  <NativeRow
                    key={a.title}
                    icon={<IconBadge icon={Award} gradient={PROFILE_ACCENT} size="md" />}
                    title={a.title}
                    subtitle={
                      <>
                        <span className="font-medium text-foreground/80">{a.place}</span>
                        <p className="mt-0.5">{a.description}</p>
                      </>
                    }
                  />
                ))}
              </NativeSection>
            )}

            {active === "experience" && (
              <NativeSection label="Experience">
                {experience.map((i) => (
                  <NativeRow
                    key={i.role + i.company}
                    icon={<IconBadge icon={Building2} gradient={PROFILE_ACCENT} size="md" />}
                    title={i.role}
                    subtitle={
                      <>
                        <span className="font-medium text-foreground/80">
                          {i.company} · {i.dates}
                        </span>
                        <p className="mt-0.5">{i.description}</p>
                      </>
                    }
                  />
                ))}
              </NativeSection>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
