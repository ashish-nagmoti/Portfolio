"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { IconBadge } from "@/components/os/icon-badge"
import { NativeSection, NativeRow } from "@/components/os/native-list"
import { cn } from "@/lib/utils"
import { Code, Code2, Cloud, Database, Users, Award, Briefcase, Building2, Star } from "lucide-react"

const skills = {
  backend: ["Python", "Django", "FastAPI", "REST APIs"],
  cloud: ["AWS", "GCP"],
  databases: ["PostgreSQL", "MongoDB", "S3"],
  ai: ["LLM Integration", "Gemini API", "Langchain", "Vector Databases"],
}

const SKILL_META = {
  backend: { icon: Code, gradient: "from-violet-400 to-indigo-600", label: "Backend" },
  cloud: { icon: Cloud, gradient: "from-sky-400 to-blue-600", label: "Cloud" },
  databases: { icon: Database, gradient: "from-emerald-400 to-green-600", label: "Databases" },
  ai: { icon: Award, gradient: "from-fuchsia-400 to-pink-600", label: "AI/ML" },
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
    stats: "50+ Repositories",
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

const internships = [
  {
    role: "Technical Intern",
    company: "Lead Cured — Remote",
    dates: "Sep 2024 – Nov 2024",
    description: "Built and tested serverless APIs using AWS Lambda, EC2, S3, IAM.",
  },
  {
    role: "Backend Intern",
    company: "PrimeAcademy — Remote",
    dates: "Mar 2025 – Aug 2025",
    description: "Worked on backend using Django and AWS deployment.",
  },
]

// A single accent runs through everything that's just "more of the same"
// content about one person (leadership, side projects, achievements,
// internships) — real macOS apps reserve color variation for things with an
// actual distinct identity (a brand, a tech domain), not for repeated rows
// of the same category.
const PROFILE_ACCENT = "from-violet-400 to-indigo-600"

const SECTIONS = [
  { id: "stats", label: "Quick Stats", icon: Star },
  { id: "profiles", label: "Coding Profiles", icon: Code2 },
  { id: "skills", label: "Skills", icon: Database },
  { id: "leadership", label: "Leadership", icon: Users },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "internships", label: "Internships", icon: Building2 },
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
            <p className="truncate text-xs text-muted-foreground">Backend Developer</p>
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
                <p className="text-sm leading-relaxed text-muted-foreground">
                  An adaptable and passionate AI and Data Science student with a 9.1 CGPA (Expected 2026) at K.K.
                  Wagh Institute of Engineering Education and Research. I love building impactful full-stack
                  applications, with a strong focus on backend development, AI integration, and cloud
                  infrastructure. From winning coding competitions to leading club events and building open-source
                  projects, I enjoy turning ideas into usable tech.
                </p>
                <NativeSection label="Quick Stats">
                  <NativeRow title="Experience" trailing={<span className="text-sm font-medium">Freelancing &amp; Internships</span>} />
                  <NativeRow title="Projects" trailing={<span className="text-sm font-medium">15+</span>} />
                  <NativeRow title="AWS Clients" trailing={<span className="text-sm font-medium">3+</span>} />
                  <NativeRow title="Focus" trailing={<span className="text-sm font-medium">Backend + AI</span>} />
                </NativeSection>
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

            {active === "internships" && (
              <NativeSection label="Internships">
                {internships.map((i) => (
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
