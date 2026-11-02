import { OSShell } from "@/components/os/os-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { PageText } from "@/components/seo/page-text"
import { pageGraph, pageMetadata, siteGraph } from "@/lib/seo"

export const metadata = pageMetadata({
  path: "/",
  title: "Ashish Nagmoti | AI Engineer & Researcher",
  description:
    "Ashish Nagmoti is an AI Engineer and Researcher at ESDS Software Solution Ltd., working on LLM inference, AI infrastructure, sovereign AI, RAG, GPU infrastructure, AI security and enterprise AI platforms.",
})

export default function Home() {
  return (
    <>
      <JsonLd graph={[...siteGraph, ...pageGraph("home")]} />
      <PageText page="home" />
      <OSShell />
    </>
  )
}
