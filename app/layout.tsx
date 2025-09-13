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
    images: [
      {
        url: '/og-image.svg', // Replace with actual PNG when converted
        width: 1200,
        height: 630,
        alt: 'Ashish Nagmoti - AI Engineer Portfolio',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashish Nagmoti - AI Engineer Portfolio",
    description: "Showcasing Ashish Nagmoti's projects in AI, backend development, and cloud systems",
    images: ['/og-image.svg'], // Replace with actual PNG when converted
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
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
