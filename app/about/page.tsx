import { OSShell } from "@/components/os/os-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { PageText } from "@/components/seo/page-text"
import { pageGraph, pageMetadata, siteGraph } from "@/lib/seo"

export const metadata = pageMetadata({
  path: "/about",
  title: "About Ashish Nagmoti | AI Engineer & Researcher at ESDS",
  description:
    "About Ashish Nagmoti, AI Engineer and Researcher at ESDS Software Solution Ltd.: experience with LLM inference, GPU infrastructure, RAG and sovereign AI, plus skills, achievements and education (B.Tech AI & Data Science, K.K. Wagh, 9.1 CGPA).",
})

export default function AboutPage() {
  return (
    <>
      <JsonLd graph={[...siteGraph, ...pageGraph("about")]} />
      <PageText page="about" />
      <OSShell initialApp="about" />
    </>
  )
}
