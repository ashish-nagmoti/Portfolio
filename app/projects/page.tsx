import { OSShell } from "@/components/os/os-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { PageText } from "@/components/seo/page-text"
import { pageGraph, pageMetadata, siteGraph } from "@/lib/seo"

export const metadata = pageMetadata({
  path: "/projects",
  title: "Projects | Ashish Nagmoti - KAVACH, SovereignRAG, System Map",
  description:
    "Projects by Ashish Nagmoti: KAVACH, an LLM security platform (1st place at Sharp Tank, ESDS), SovereignRAG decentralized enterprise RAG, the System Map codebase visualizer, StoryMail and more.",
})

export default function ProjectsPage() {
  return (
    <>
      <JsonLd graph={[...siteGraph, ...pageGraph("projects")]} />
      <PageText page="projects" />
      <OSShell initialApp="projects" />
    </>
  )
}
