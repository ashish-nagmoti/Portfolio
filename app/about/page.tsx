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
  backend: ["Python", "Django", "FastAPI", "REST APIs", "GraphQL"],
  cloud: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform"],
  databases: ["PostgreSQL", "MongoDB", "Redis", "DynamoDB"],
  ai: ["LLM Integration", "OpenAI API", "Langchain", "Vector Databases"],
}

const codingProfiles = [
  {
    platform: "LeetCode",
    username: "your-username",
    url: "https://leetcode.com/your-username",
    stats: "500+ Problems Solved",
    description: "Regular practice in algorithms and data structures",
    color: "from-orange-500 to-yellow-500",
  },
  {
    platform: "GitHub",
    username: "your-username",
    url: "https://github.com/your-username",
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
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About Me</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI Engineering student with a passion for building scalable backend systems and cloud-native applications.
            </p>
          </motion.div>

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
                  <p className="text-muted-foreground">
                    I'm an AI Engineering student with over 4 years of experience in backend development. My journey
                    started with Python and has evolved into building complex, scalable systems using modern frameworks
                    and cloud technologies.
                  </p>
                  <p className="text-muted-foreground">
                    I specialize in API development, cloud architecture, and integrating AI/ML capabilities into
                    production systems. My approach focuses on clean code, performance optimization, and maintainable
                    architectures.
                  </p>
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
                    <span className="font-semibold">4+ Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-semibold">15+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AWS Clients</span>
                    <span className="font-semibold">5+</span>
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
                    <h3 className="font-semibold">Young Indians</h3>
                    <p className="text-sm text-muted-foreground">Innovation Head</p>
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
                    Professional Work
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold">AWS Client Projects</h3>
                    <p className="text-sm text-muted-foreground">Cloud Solutions</p>
                    <p className="text-sm mt-2">
                      Architected and deployed scalable cloud solutions for enterprise clients.
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <h3 className="font-semibold">Freelance Development</h3>
                    <p className="text-sm text-muted-foreground">Backend Systems</p>
                    <p className="text-sm mt-2">
                      Built custom APIs and backend systems for various startups and businesses.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
