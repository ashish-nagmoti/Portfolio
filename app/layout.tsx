import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Ashish Nagmoti | AI Engineer | Backend Developer",
  description:
    "Portfolio of Ashish Nagmoti, an AI Engineering student specializing in Python, Django, FastAPI, and cloud platforms.",
  keywords: ["Ashish Nagmoti", "AI Engineer", "Backend Developer", "Python", "Django", "FastAPI", "AWS", "GCP"],
  authors: [{ name: "Ashish Nagmoti" }],
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${mono.className} bg-[var(--bg)] text-[var(--phosphor)]`}>{children}</body>
    </html>
  )
}
