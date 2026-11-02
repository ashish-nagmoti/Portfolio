import { OSShell } from "@/components/os/os-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { PageText } from "@/components/seo/page-text"
import { pageGraph, pageMetadata, siteGraph } from "@/lib/seo"

export const metadata = pageMetadata({
  path: "/contact",
  title: "Contact | Ashish Nagmoti",
  description:
    "Get in touch with Ashish Nagmoti, AI Engineer and Researcher at ESDS Software Solution Ltd., by email or on LinkedIn and GitHub.",
})

export default function ContactPage() {
  return (
    <>
      <JsonLd graph={[...siteGraph, ...pageGraph("contact")]} />
      <PageText page="contact" />
      <OSShell initialApp="contact" />
    </>
  )
}
