"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Linkedin, Github, Twitter, Heart, ArrowUp } from "lucide-react"

const socialLinks = [
  {
    icon: Mail,
    href: "mailto:your.email@example.com",
    label: "Email",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/your-profile",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "https://github.com/your-username",
    label: "GitHub",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/your_twitter_handle",
    label: "Twitter",
  },
]

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/interests", label: "Interests" },
  { href: "/blog", label: "Blog" },
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="font-bold text-xl mb-4 block">
                {"<AI_Engineer />"}
              </Link>
              <p className="text-muted-foreground mb-4 max-w-md">
                AI Engineering student specializing in Python, Django, FastAPI, and cloud platforms. Building scalable
                backend systems and AI-powered applications.
              </p>
              <div className="flex space-x-2">
                {socialLinks.map((link) => (
                  <Button key={link.label} variant="ghost" size="sm" asChild>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                      <link.icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>your.email@example.com</p>
                <p>Your City, Country</p>
                <p>UTC+5:30 (IST)</p>
                <p className="text-xs mt-4">Available for freelance projects and consulting</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:md:mb-0">
              © 2024 AI Engineer Portfolio. Built with <Heart className="inline h-4 w-4 text-red-500" /> using Next.js
              and Tailwind CSS.
            </p>

            <Button variant="ghost" size="sm" onClick={scrollToTop}>
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
