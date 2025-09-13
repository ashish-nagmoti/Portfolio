import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ashish Nagmoti | AI Engineer | Backend Developer",
  description: "Portfolio of Ashish Nagmoti, an AI Engineering student specializing in Python, Django, FastAPI, and cloud platforms.",
  keywords: ["Ashish Nagmoti", "AI Engineer", "Backend Developer", "Python", "Django", "FastAPI", "AWS", "GCP", "Cloud Native", "Data Science"],
  authors: [{ name: "Ashish Nagmoti" }],
  creator: "Ashish Nagmoti",
  publisher: "Ashish Nagmoti",
  openGraph: {
    title: "Ashish Nagmoti - AI Engineer Portfolio",
    description: "Showcasing Ashish Nagmoti's projects in AI, backend development, and cloud systems",
    type: "website",
    locale: "en_US",
    siteName: "Ashish Nagmoti Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashish Nagmoti - AI Engineer Portfolio",
    description: "Showcasing Ashish Nagmoti's projects in AI, backend development, and cloud systems",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'Next.js'
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
