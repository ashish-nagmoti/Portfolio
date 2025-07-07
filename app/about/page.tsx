"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Cloud, Database, Users, Award, Briefcase, GraduationCap, Star, ExternalLink } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
    color: "from-orange-500 to-yellow-500",
  },
  {
    platform: "GitHub",
    username: "ashish-nagmoti",
    url: "https://github.com/ashish-nagmoti",
    stats: "50+ Repositories",
    description: "Open source contributions and personal projects",
    color: "from-gray-700 to-gray-900",
  },
]

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-20">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Background */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h1 className="text-4xl font-bold mb-2">Ashish Nagmoti</h1>
                  <p className="text-muted-foreground">
                    An adaptable and passionate AI and Data Science student with a 9.1 CGPA (Expected 2026) at K.K. Wagh Institute of Engineering Education and Research. I love building impactful full-stack applications, with a strong focus on backend development, AI integration, and cloud infrastructure. From winning coding competitions to leading club events and building open-source projects, I enjoy turning ideas into usable tech.
                  </p>
                  {/* <p className="text-muted-foreground">
                    I'm an AI Engineering student with over 4 years of experience in backend development. My journey
                    started with Python and has evolved into building complex, scalable systems using modern frameworks
                    and cloud technologies.
                  </p>
                  <p className="text-muted-foreground">
                    I specialize in API development, cloud architecture, and integrating AI/ML capabilities into
                    production systems. My approach focuses on clean code, performance optimization, and maintainable
                    architectures.
                  </p> */}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-semibold">Freelancing and Internships</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-semibold">15+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AWS Clients</span>
                    <span className="font-semibold">3+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Focus</span>
                    <span className="font-semibold">Backend + AI</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Coding Profiles */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Coding Profiles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {codingProfiles.map((profile) => (
                <Card key={profile.platform} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${profile.color}`}>
                          <Code className="h-5 w-5 text-white" />
                        </div>
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
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Technical Skills</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(skills).map(([category, skillList]) => {
                const icons = {
                  backend: Code,
                  cloud: Cloud,
                  databases: Database,
                  ai: Award,
                }
                const Icon = icons[category as keyof typeof icons]

                return (
                  <Card key={category} className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 capitalize">
                        <Icon className="h-5 w-5" />
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
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Leadership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold">Phoenix Club</h3>
                    <p className="text-sm text-muted-foreground">Vice President</p>
                    <p className="text-sm mt-2">
                      Leading technical initiatives and organizing tech events for 200+ members.
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold">Innovera hackathon</h3>
                    <p className="text-sm text-muted-foreground">WEB and IT head</p>
                    <p className="text-sm mt-2">Managed team of 10+ people for making website and managing technical aspects of hackathon.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
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
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold text-white">StoryMail – AI-Powered Smart Email Platform</h3>
                    <p className="text-sm text-white font-medium">Mar 2024 – Oct 2024</p>
                    <p className="text-sm text-white">Tech Stack: Django, Auth0, Postgres SQL, GeminiAPI</p>
                    <p className="text-sm text-white">AI platform for email classification, weekly digests, and querying.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold text-white">KalaShala – Platform Empowering Local Artists</h3>
                    <p className="text-sm text-white font-medium">Feb 2024 – Mar 2024</p>
                    <p className="text-sm text-white">Role: Backend Development and Deployment</p>
                    <p className="text-sm text-white">Platform for local artists to showcase, publish content, and grow.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold text-white">AceUp – Student Resource Hub with AI Chatbot</h3>
                    <p className="text-sm text-white font-medium">Tech Stack: Django, Tailwind CSS, Jinja, SQLite3, Python</p>
                    <p className="text-sm text-white">Student hub with notes, roadmaps, events, and chatbot.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Achievements */}
          <motion.div variants={itemVariants} className="mb-16">
            <br /><br />
            <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
              <Award className="h-7 w-7 text-yellow-400 drop-shadow-md" />
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">Achievements</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 border border-yellow-300 rounded-xl p-5 shadow-sm backdrop-blur-sm bg-transparent">
                <Award className="h-7 w-7 text-yellow-400 mt-1 drop-shadow" />
                <div>
                  <h3 className="font-semibold text-white">Codethon – Arambh</h3>
                  <p className="text-sm text-white font-medium">Winner (1st place)</p>
                  <p className="text-sm text-white">Coding competition winner for innovative solutions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-yellow-300 rounded-xl p-5 shadow-sm backdrop-blur-sm bg-transparent">
                <Award className="h-7 w-7 text-yellow-400 mt-1 drop-shadow" />
                <div>
                  <h3 className="font-semibold text-white">Code-O-Fiesta 2.0</h3>
                  <p className="text-sm text-white font-medium">3rd Place</p>
                  <p className="text-sm text-white">Placed 3rd in a competitive coding event.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-yellow-300 rounded-xl p-5 shadow-sm backdrop-blur-sm bg-transparent">
                <Award className="h-7 w-7 text-yellow-400 mt-1 drop-shadow" />
                <div>
                  <h3 className="font-semibold text-white">Social Winter of Code</h3>
                  <p className="text-sm text-white font-medium">Contributor</p>
                  <p className="text-sm text-white">Completed open-source contributions under SWOC.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Internships */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
              <Briefcase className="h-7 w-7 text-blue-400 drop-shadow-md" />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Internships</span>
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {/* <div className="flex items-start gap-4 border border-blue-300 rounded-xl p-5 shadow-sm backdrop-blur-sm bg-transparent">
                <Briefcase className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Web Development</h3>
                  <p className="text-sm text-white font-medium">Developed robust website backends and implemented advanced web scraping solutions during internship roles.</p>
                </div>
              </div> */}
              <div className="flex items-start gap-4 border border-blue-300 rounded-xl p-5 shadow-sm backdrop-blur-sm bg-transparent">
                <Briefcase className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Technical Intern</h3>
                  <p className="text-sm text-white font-medium">Lead Cured - Remote</p>
                  <p className="text-sm text-white">Sep 2024 – Nov 2024</p>
                  <p className="text-sm text-white">Key Skills: Built and tested serverless APIs using AWS Lambda, EC2, S3, IAM.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 border border-blue-300 rounded-xl p-5 shadow-sm backdrop-blur-sm bg-transparent">
                <Briefcase className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Backend Intern</h3>
                  <p className="text-sm text-white font-medium">PrimeAcademy - Remote</p>
                  <p className="text-sm text-white">Mar 2025 – Aug 2025</p>
                  <p className="text-sm text-white">Worked on backend using Django and AWS deployment.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
