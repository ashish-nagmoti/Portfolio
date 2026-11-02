import type { Metadata } from "next"
import { SITE_URL, achievements, person, projects, skills } from "@/lib/profile"
import type { MediumPost } from "@/lib/medium"

const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "Ashish Nagmoti - AI Engineer & Researcher" }

/**
 * A route's title, description and canonical URL, with matching link
 * previews. Next replaces (not merges) a parent's openGraph and twitter
 * objects, so each page restates the preview image.
 */
export function pageMetadata({ path, title, description }: { path: string; title: string; description: string }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: path === "/" || path === "/about" ? "profile" : "website",
      siteName: "Ashish Nagmoti",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  }
}

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

/** Who the site is about and the site itself, on every page; the rest point back to these by @id. */
export const siteGraph = [
  {
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    givenName: person.givenName,
    familyName: person.familyName,
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    jobTitle: person.jobTitle,
    description: person.summary,
    email: `mailto:${person.email}`,
    address: { "@type": "PostalAddress", addressRegion: "Maharashtra", addressCountry: "IN" },
    worksFor: { "@type": "Organization", name: person.employer.name, url: person.employer.url },
    alumniOf: { "@type": "CollegeOrUniversity", name: person.education.school },
    hasCredential: { "@type": "EducationalOccupationalCredential", name: person.education.degree, credentialCategory: "degree" },
    knowsAbout: [...new Set([...Object.values(skills).flat(), "Sovereign AI", "AI Security", "Retrieval-Augmented Generation"])],
    award: achievements.map((a) => `${a.title} - ${a.place}`),
    sameAs: Object.values(person.profiles),
  },
  {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Ashish Nagmoti",
    description: `Portfolio of ${person.name}, ${person.jobTitle} at ${person.employer.name}`,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  },
]

const crumbs = (name: string, path: string) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
  ],
})

const webPage = (type: string, path: string, name: string, extra: Record<string, unknown> = {}) => ({
  "@type": type,
  "@id": `${SITE_URL}${path}#page`,
  url: `${SITE_URL}${path}`,
  name,
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": PERSON_ID },
  ...extra,
})

/** The structured data for one page, besides the site-wide graph. */
export function pageGraph(page: "home" | "about" | "projects" | "blog" | "interests" | "contact", posts: MediumPost[] = []) {
  switch (page) {
    case "home":
      return [webPage("ProfilePage", "/", person.name, { mainEntity: { "@id": PERSON_ID } })]
    case "about":
      return [
        webPage("ProfilePage", "/about", `About ${person.name}`, { mainEntity: { "@id": PERSON_ID } }),
        crumbs("About", "/about"),
      ]
    case "projects":
      return [
        webPage("CollectionPage", "/projects", `Projects by ${person.name}`, {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": p.github ? "SoftwareSourceCode" : "CreativeWork",
                name: p.title,
                description: p.longDescription,
                keywords: p.tech.join(", "),
                creator: { "@id": PERSON_ID },
                ...(p.github && { codeRepository: p.github }),
                ...((p.demo || p.github) && { url: p.demo || p.github }),
              },
            })),
          },
        }),
        crumbs("Projects", "/projects"),
      ]
    case "blog":
      return [
        {
          "@type": "Blog",
          "@id": `${SITE_URL}/blog#blog`,
          url: `${SITE_URL}/blog`,
          name: `${person.name}'s Blog`,
          author: { "@id": PERSON_ID },
          isPartOf: { "@id": WEBSITE_ID },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: p.url,
            datePublished: p.date,
            description: p.excerpt,
            keywords: p.tags.join(", "),
            author: { "@id": PERSON_ID },
          })),
        },
        crumbs("Blog", "/blog"),
      ]
    case "interests":
      return [webPage("CollectionPage", "/interests", `${person.name}'s Interests`), crumbs("Interests", "/interests")]
    case "contact":
      return [webPage("ContactPage", "/contact", `Contact ${person.name}`), crumbs("Contact", "/contact")]
  }
}
