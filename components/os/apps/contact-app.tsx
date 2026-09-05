"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconBadge } from "@/components/os/icon-badge"
import { NativeSection, NativeRow } from "@/components/os/native-list"
import { Mail, Linkedin, Github, Globe, MapPin, Clock, ExternalLink, Copy, Check } from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "ashishnagmoti2310@gmail.com",
    href: "mailto:ashishnagmoti2310@gmail.com",
    description: "Best for project inquiries and detailed discussions",
    primary: true,
    gradient: "from-violet-400 to-indigo-600",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/ashish-nagmoti",
    href: "https://www.linkedin.com/in/ashish-nagmoti-54269b249",
    description: "Professional networking and career opportunities",
    primary: true,
    gradient: "from-sky-500 to-blue-700",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/ashish-nagmoti",
    href: "https://github.com/ashish-nagmoti",
    description: "Check out my code and open source contributions",
    primary: false,
    gradient: "from-zinc-700 to-zinc-900",
  },
  {
    icon: Globe,
    label: "Medium Blog",
    value: "https://medium.com/@ashishnagmoti7",
    href: "https://medium.com/@ashishnagmoti7",
    description: "My technical blog on Medium",
    primary: false,
    gradient: "from-slate-600 to-slate-800",
  },
]

const services = [
  "Python/Django/FastAPI Development",
  "AWS Cloud Solutions & Migration",
  "API Design & Development",
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function ContactApp() {
  const [copiedEmail, setCopiedEmail] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("ashishnagmoti2310@gmail.com")
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <NativeSection label="Get In Touch">
            {contactMethods.map((method) => (
              <NativeRow
                key={method.label}
                icon={<IconBadge icon={method.icon} gradient={method.gradient} size="md" />}
                title={
                  <span className="flex items-center gap-2">
                    {method.label}
                    {method.primary && (
                      <Badge variant="secondary" className="text-xs">
                        Preferred
                      </Badge>
                    )}
                  </span>
                }
                subtitle={
                  <>
                    {method.description}
                    <p className="mt-0.5 font-mono text-primary">{method.value}</p>
                  </>
                }
                trailing={
                  <div className="flex shrink-0 gap-1">
                    {method.label === "Email" && (
                      <Button variant="ghost" size="sm" onClick={copyEmail}>
                        {copiedEmail ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <a href={method.href} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                }
              />
            ))}
          </NativeSection>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <NativeSection label="Location & Availability">
            <NativeRow
              icon={<IconBadge icon={MapPin} gradient="from-emerald-400 to-green-600" size="md" />}
              title="Maharashtra, India"
              subtitle="Open to work (remote/onsite)"
            />
            <NativeRow
              icon={<IconBadge icon={Clock} gradient="from-amber-400 to-orange-500" size="md" />}
              title="UTC+5:30 (IST)"
              subtitle="Flexible with global teams"
            />
          </NativeSection>

          <NativeSection label="Services Offered">
            {services.map((service) => (
              <NativeRow key={service} title={service} />
            ))}
          </NativeSection>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="text-center">
        <div className="rounded-2xl border border-black/[0.06] bg-gradient-to-br from-clay-indigo/10 via-primary/5 to-clay-sky/10 p-6 dark:border-white/[0.08] md:p-8">
          <h3 className="text-lg font-bold mb-3">Ready to Start Your Project?</h3>
          <p className="text-muted-foreground mb-5 text-sm max-w-2xl mx-auto">
            Whether you need a scalable backend system, cloud migration, or AI integration, I'm here to help bring
            your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <a href="mailto:ashishnagmoti2310@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://www.linkedin.com/in/ashish-nagmoti-54269b249" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                Connect on LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
