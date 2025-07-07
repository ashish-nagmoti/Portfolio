import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Engineer | Backend Developer | Cloud Native",
  description: "Portfolio of an AI Engineering student specializing in Python, Django, FastAPI, and cloud platforms.",
  keywords: ["AI Engineer", "Backend Developer", "Python", "Django", "FastAPI", "AWS", "GCP"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "AI Engineer Portfolio",
    description: "Showcasing projects in API automation, cloud orchestration, and AI systems",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
