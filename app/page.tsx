import { Nav } from "@/components/retro/nav"
import { Hero } from "@/components/retro/hero"
import { About } from "@/components/retro/about"
import { Projects } from "@/components/retro/projects"
import { Blog } from "@/components/retro/blog"
import { Contact } from "@/components/retro/contact"
import { Footer } from "@/components/retro/footer"
import { ScanlineOverlay } from "@/components/retro/scanline-overlay"
import { PhosphorToggle } from "@/components/retro/phosphor-toggle"
import JsonLd from "@/components/json-ld"

export default function Home() {
  return (
    <>
      <JsonLd />
      <ScanlineOverlay />
      <PhosphorToggle />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
