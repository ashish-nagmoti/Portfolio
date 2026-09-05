"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconBadge } from "@/components/os/icon-badge"
import { Code, Cloud, Database, Users, Award, Briefcase, GraduationCap, Star, ExternalLink } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const skills = {
  backend: ["Python", "Django", "FastAPI", "REST APIs"],
  cloud: ["AWS", "GCP"],
  databases: ["PostgreSQL", "MongoDB", "S3"],
  ai: ["LLM Integration", "Gemini API", "Langchain", "Vector Databases"],
}

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

export function AboutApp() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-8">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <IconBadge icon={GraduationCap} gradient="from-violet-400 to-indigo-600" size="sm" />
                Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-3xl font-bold mb-2">Ashish Nagmoti</h1>
              <p className="text-muted-foreground">
                An adaptable and passionate AI and Data Science student with a 9.1 CGPA (Expected 2026) at K.K. Wagh Institute of Engineering Education and Research. I love building impactful full-stack applications, with a strong focus on backend development, AI integration, and cloud infrastructure. From winning coding competitions to leading club events and building open-source projects, I enjoy turning ideas into usable tech.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <IconBadge icon={Star} gradient="from-amber-400 to-orange-500" size="sm" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Experience</span>
                <span className="font-semibold text-right">Freelancing & Internships</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Projects</span>
                <span className="font-semibold text-right">15+</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">AWS Clients</span>
                <span className="font-semibold text-right">3+</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">Focus</span>
                <span className="font-semibold text-right">Backend + AI</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Coding Profiles */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4">Coding Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {codingProfiles.map((profile) => (
            <Card key={profile.platform} className="group hover:-translate-y-1 hover:shadow-clay-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconBadge icon={Code} gradient={profile.gradient} size="md" />
                    <div>
                      <span className="group-hover:text-primary transition-colors">{profile.platform}</span>
                      <p className="text-sm text-muted-foreground font-normal">@{profile.username}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={profile.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Achievement</span>
                    <Badge variant="secondary">{profile.stats}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Skills Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(skills).map(([category, skillList]) => {
            const icons = {
              backend: Code,
              cloud: Cloud,
              databases: Database,
              ai: Award,
            }
            const gradients = {
              backend: "from-violet-400 to-indigo-600",
              cloud: "from-sky-400 to-blue-600",
              databases: "from-emerald-400 to-green-600",
              ai: "from-fuchsia-400 to-pink-600",
            }
            const Icon = icons[category as keyof typeof icons]

            return (
              <Card key={category} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 capitalize text-base">
                    <IconBadge icon={Icon} gradient={gradients[category as keyof typeof gradients]} size="sm" />
                    {category === "ai" ? "AI/ML" : category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Leadership & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <IconBadge icon={Users} gradient="from-sky-400 to-blue-600" size="sm" />
                Leadership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-background shadow-clay-inset p-4">
                <h3 className="font-semibold">Phoenix Club</h3>
                <p className="text-sm text-muted-foreground">Vice President</p>
                <p className="text-sm mt-2">
                  Leading technical initiatives and organizing tech events for 200+ members.
                </p>
              </div>
              <div className="rounded-2xl bg-background shadow-clay-inset p-4">
                <h3 className="font-semibold">Innovera hackathon</h3>
                <p className="text-sm text-muted-foreground">WEB and IT head</p>
                <p className="text-sm mt-2">Managed team of 10+ people for making website and managing technical aspects of hackathon.</p>
              </div>
              <div className="rounded-2xl bg-background shadow-clay-inset p-4">
                <h3 className="font-semibold">Young Indians Nashik Chapter</h3>
                <p className="text-sm text-muted-foreground">Student Coordinator (Innovation)</p>
                <p className="text-sm mt-2">Driving innovation projects and mentoring emerging entrepreneurs.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <IconBadge icon={Briefcase} gradient="from-cyan-400 to-teal-600" size="sm" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-background shadow-clay-inset p-4">
                <h3 className="font-semibold">StoryMail – AI-Powered Smart Email Platform</h3>
                <p className="text-sm text-muted-foreground font-medium">Mar 2024 – Oct 2024</p>
                <p className="text-sm text-muted-foreground">Tech Stack: Django, Auth0, Postgres SQL, GeminiAPI</p>
                <p className="text-sm mt-1">AI platform for email classification, weekly digests, and querying.</p>
              </div>
              <div className="rounded-2xl bg-background shadow-clay-inset p-4">
                <h3 className="font-semibold">KalaShala – Platform Empowering Local Artists</h3>
                <p className="text-sm text-muted-foreground font-medium">Feb 2024 – Mar 2024</p>
                <p className="text-sm text-muted-foreground">Role: Backend Development and Deployment</p>
                <p className="text-sm mt-1">Platform for local artists to showcase, publish content, and grow.</p>
              </div>
              <div className="rounded-2xl bg-background shadow-clay-inset p-4">
                <h3 className="font-semibold">AceUp – Student Resource Hub with AI Chatbot</h3>
                <p className="text-sm text-muted-foreground font-medium">Tech Stack: Django, Tailwind CSS, Jinja, SQLite3, Python</p>
                <p className="text-sm mt-1">Student hub with notes, roadmaps, events, and chatbot.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5">
          <IconBadge icon={Award} gradient="from-amber-400 to-orange-500" size="sm" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 rounded-2xl bg-card shadow-clay p-5">
            <IconBadge icon={Award} gradient="from-amber-400 to-orange-500" size="md" />
            <div>
              <h3 className="font-semibold">Codethon – Arambh</h3>
              <p className="text-sm text-muted-foreground font-medium">Winner (1st place)</p>
              <p className="text-sm mt-1">Coding competition winner for innovative solutions.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl bg-card shadow-clay p-5">
            <IconBadge icon={Award} gradient="from-amber-400 to-orange-500" size="md" />
            <div>
              <h3 className="font-semibold">Code-O-Fiesta 2.0</h3>
              <p className="text-sm text-muted-foreground font-medium">3rd Place</p>
              <p className="text-sm mt-1">Placed 3rd in a competitive coding event.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl bg-card shadow-clay p-5 md:col-span-2">
            <IconBadge icon={Award} gradient="from-amber-400 to-orange-500" size="md" />
            <div>
              <h3 className="font-semibold">Social Winter of Code</h3>
              <p className="text-sm text-muted-foreground font-medium">Contributor</p>
              <p className="text-sm mt-1">Completed open-source contributions under SWOC.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Internships */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5">
          <IconBadge icon={Briefcase} gradient="from-sky-400 to-blue-600" size="sm" />
          Internships
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 rounded-2xl bg-card shadow-clay p-5">
            <IconBadge icon={Briefcase} gradient="from-sky-400 to-blue-600" size="md" />
            <div>
              <h3 className="font-semibold">Technical Intern</h3>
              <p className="text-sm text-muted-foreground font-medium">Lead Cured - Remote</p>
              <p className="text-sm text-muted-foreground">Sep 2024 – Nov 2024</p>
              <p className="text-sm mt-1">Key Skills: Built and tested serverless APIs using AWS Lambda, EC2, S3, IAM.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl bg-card shadow-clay p-5">
            <IconBadge icon={Briefcase} gradient="from-sky-400 to-blue-600" size="md" />
            <div>
              <h3 className="font-semibold">Backend Intern</h3>
              <p className="text-sm text-muted-foreground font-medium">PrimeAcademy - Remote</p>
              <p className="text-sm text-muted-foreground">Mar 2025 – Aug 2025</p>
              <p className="text-sm mt-1">Worked on backend using Django and AWS deployment.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
