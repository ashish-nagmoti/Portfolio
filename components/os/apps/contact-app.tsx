"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconBadge } from "@/components/os/icon-badge"
import {
  Mail,
  Linkedin,
  Github,
  Globe,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <IconBadge icon={MessageCircle} gradient="from-violet-400 to-indigo-600" size="sm" />
                Get In Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contactMethods.map((method) => (
                <div
                  key={method.label}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-shadow hover:shadow-clay-sm ${
                    method.primary ? "bg-primary/5 shadow-clay-inset" : "bg-background shadow-clay-inset"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <IconBadge icon={method.icon} gradient={method.gradient} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{method.label}</span>
                        {method.primary && (
                          <Badge variant="secondary" className="text-xs">
                            Preferred
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      <p className="text-sm font-mono text-primary truncate">{method.value}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
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
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <IconBadge icon={MapPin} gradient="from-emerald-400 to-green-600" size="sm" />
                Location & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <IconBadge icon={MapPin} gradient="from-emerald-400 to-green-600" size="md" />
                <div>
                  <p className="font-medium">Maharashtra, India</p>
                  <p className="text-sm text-muted-foreground">Open to work (remote/onsite)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconBadge icon={Clock} gradient="from-amber-400 to-orange-500" size="md" />
                <div>
                  <p className="font-medium">UTC+5:30 (IST)</p>
                  <p className="text-sm text-muted-foreground">Flexible with global teams</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.map((service) => (
                  <div key={service} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="text-center">
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-clay-indigo/15 via-primary/10 to-clay-sky/15 shadow-clay">
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
