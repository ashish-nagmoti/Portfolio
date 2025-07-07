"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Linkedin,
  Github,
  Globe,
  Twitter,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"
import { useState } from "react"

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "your.email@example.com",
    href: "mailto:your.email@example.com",
    description: "Best for project inquiries and detailed discussions",
    primary: true,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/your-profile",
    href: "https://linkedin.com/in/your-profile",
    description: "Professional networking and career opportunities",
    primary: true,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/your-username",
    href: "https://github.com/your-username",
    description: "Check out my code and open source contributions",
    primary: false,
  },
  {
    icon: Twitter,
    label: "Twitter",
    value: "@your_twitter_handle",
    href: "https://twitter.com/your_twitter_handle",
    description: "Tech discussions and industry insights",
    primary: false,
  },
  {
    icon: Globe,
    label: "Portfolio",
    value: "your-portfolio.com",
    href: "https://your-portfolio.com",
    description: "This website - showcase of my work",
    primary: false,
  },
]

const services = [
  "Python/Django/FastAPI Development",
  "AWS Cloud Solutions & Migration",
  "API Design & Development",
  "System Architecture Consulting",
  "Code Reviews & Technical Mentoring",
  "AI/ML Integration & Consulting",
]

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

export function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("your.email@example.com")
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to build something amazing? I'm available for freelance projects, consulting, and full-time
              opportunities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Methods */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Get In Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method) => (
                    <div
                      key={method.label}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        method.primary ? "border-primary/20 bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${method.primary ? "bg-primary/10" : "bg-muted"}`}>
                          <method.icon
                            className={`h-5 w-5 ${method.primary ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{method.label}</span>
                            {method.primary && (
                              <Badge variant="secondary" className="text-xs">
                                Preferred
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <p className="text-sm font-mono text-primary">{method.value}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
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

            {/* Additional Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Location & Timezone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Your City, Country</p>
                      <p className="text-sm text-muted-foreground">Open to remote work</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">UTC+5:30 (IST)</p>
                      <p className="text-sm text-muted-foreground">Flexible with global teams</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {services.map((service) => (
                      <div key={service} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border">
              <h3 className="text-xl font-bold mb-4">Ready to Start Your Project?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you need a scalable backend system, cloud migration, or AI integration, I'm here to help bring
                your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="mailto:your.email@example.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    Connect on LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
