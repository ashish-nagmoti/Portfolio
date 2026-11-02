/**
 * Structured data for search engines, rendered on the server so it's in the
 * HTML itself (the desktop is drawn client-side). `<` is escaped so no string
 * in it can close the script tag.
 */
export function JsonLd({ graph }: { graph: object[] }) {
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
