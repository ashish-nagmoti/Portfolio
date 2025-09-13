"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Terminal } from "@/components/terminal"
import { ArrowRight, Download, Code, Cloud, Brain } from "lucide-react"
import Link from "next/link"
import { ContactSection } from "@/components/contact-section"
import JsonLd from "@/components/json-ld"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      <JsonLd />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-gray-200 relative z-10 font-extrabold [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
                Ashish Nagmoti
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl md:text-4xl text-gray-400"
              >
                AI & DS Student | Backend & Cloud Developer
              </motion.span>
            </motion.h1>
          </motion.div>

          <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            I love building impactful full-stack applications, with a strong focus on backend development, AI integration, and cloud infrastructure.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="group">
              <Link href="/projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="group bg-transparent">
              <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Download Resume
            </Button>
          </motion.div>

          {/* Tech Icons */}
          <motion.div variants={itemVariants} className="flex justify-center space-x-8 mb-16">
            {[
              { icon: Code, label: "Backend" },
              { icon: Cloud, label: "Cloud" },
              { icon: Brain, label: "AI/ML" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center space-y-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 rounded-full bg-gray-900 border border-gray-700">
                  <item.icon className="h-6 w-6 text-gray-300" />
                </div>
                <span className="text-sm text-gray-400">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Terminal Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Interactive Terminal</h2>
          <p className="text-muted-foreground mb-8">
            Try commands like <code className="bg-muted px-2 py-1 rounded">neofetch</code>,
            <code className="bg-muted px-2 py-1 rounded mx-2">about</code>, or
            <code className="bg-muted px-2 py-1 rounded">projects</code>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Terminal />
        </motion.div>
      </section>
      <ContactSection />
    </div>
  )
}
