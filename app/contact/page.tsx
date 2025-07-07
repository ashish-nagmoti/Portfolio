"use client"

import { ContactSection } from "@/components/contact-section"
import { motion } from "framer-motion"

export default function Contact() {
  return (
    <div className="min-h-screen pt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <ContactSection />
      </motion.div>
    </div>
  )
}
