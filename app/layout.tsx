import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ashish Nagmoti | AI Engineer & Researcher",
  description:
    "Portfolio of Ashish Nagmoti, AI Engineer and Researcher at ESDS Software Solution Ltd., working on LLM inference, AI infrastructure, sovereign AI, RAG, GPU infrastructure, AI security and enterprise AI platforms.",
  keywords: [
    "Ashish Nagmoti",
    "AI Engineer",
    "AI Researcher",
    "LLM Inference",
    "AI Infrastructure",
    "Sovereign AI",
    "RAG",
    "GPU Infrastructure",
    "vLLM",
    "Kubernetes",
    "AI Security",
    "Enterprise AI",
    "ESDS",
    "Python",
    "FastAPI",
  ],
  authors: [{ name: "Ashish Nagmoti" }],
  creator: "Ashish Nagmoti",
  publisher: "Ashish Nagmoti",
  openGraph: {
    title: "Ashish Nagmoti — AI Engineer & Researcher",
    description: "AI Engineer and Researcher at ESDS: LLM inference, AI infrastructure, sovereign AI, RAG and GPU platforms",
    type: "website",
    locale: "en_US",
    siteName: "Ashish Nagmoti Portfolio",
    images: [
      {
        url: '/og-image.svg', // Replace with actual PNG when converted
        width: 1200,
        height: 630,
        alt: 'Ashish Nagmoti — AI Engineer & Researcher',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashish Nagmoti — AI Engineer & Researcher",
    description: "AI Engineer and Researcher at ESDS: LLM inference, AI infrastructure, sovereign AI, RAG and GPU platforms",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
