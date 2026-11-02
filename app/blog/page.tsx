import { OSShell } from "@/components/os/os-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { PageText } from "@/components/seo/page-text"
import { getMediumFeed } from "@/lib/medium-feed"
import { pageGraph, pageMetadata, siteGraph } from "@/lib/seo"

// The story list in the HTML is the live Medium feed, refreshed hourly like /api/medium
export const revalidate = 3600

export const metadata = pageMetadata({
  path: "/blog",
  title: "Blog | Ashish Nagmoti",
  description: "Ashish Nagmoti's writing on AI engineering, AWS and cloud computing, Linux and learning to code.",
})

export default async function BlogPage() {
  const { posts } = await getMediumFeed()
  return (
    <>
      <JsonLd graph={[...siteGraph, ...pageGraph("blog", posts)]} />
      <PageText page="blog" posts={posts} />
      <OSShell initialApp="blog" />
    </>
  )
}
