import { OSShell } from "@/components/os/os-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { PageText } from "@/components/seo/page-text"
import { pageGraph, pageMetadata, siteGraph } from "@/lib/seo"

export const metadata = pageMetadata({
  path: "/interests",
  title: "Interests | Ashish Nagmoti",
  description:
    "The blogs, articles and videos Ashish Nagmoti, AI Engineer and Researcher, recommends, and what he's into outside work.",
})

export default function InterestsPage() {
  return (
    <>
      <JsonLd graph={[...siteGraph, ...pageGraph("interests")]} />
      <PageText page="interests" />
      <OSShell initialApp="interests" />
    </>
  )
}
