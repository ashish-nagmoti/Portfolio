import { achievements, experience, leadership, person, projects, skillLabels, skills, type SkillGroup } from "@/lib/profile"
import { siteContent } from "@/lib/site-content"
import type { MediumPost } from "@/lib/medium"

export type SeoPage = "home" | "about" | "projects" | "blog" | "interests" | "contact"

const NAV: [string, string][] = [
  ["/", "Home"],
  ["/about", "About"],
  ["/projects", "Projects"],
  ["/blog", "Blog"],
  ["/interests", "Interests"],
  ["/contact", "Contact"],
]

/**
 * The page as plain text, rendered on the server. The desktop itself is drawn
 * in the browser, so without this the HTML a search engine fetches has an
 * empty body. It's the same content the apps show, laid out as an ordinary
 * document: visually hidden, but there for crawlers and screen readers.
 */
export function PageText({ page, posts = [] }: { page: SeoPage; posts?: MediumPost[] }) {
  return (
    <div className="sr-only">
      <nav aria-label="Site">
        <ul>
          {NAV.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
          <li>
            <a href={person.resume}>Résumé (PDF)</a>
          </li>
        </ul>
      </nav>
      <article>
        {page === "home" && <Home />}
        {page === "about" && <About />}
        {page === "projects" && <Projects />}
        {page === "blog" && <Blog posts={posts} />}
        {page === "interests" && <Interests />}
        {page === "contact" && <Contact />}
      </article>
    </div>
  )
}

function Home() {
  return (
    <>
      <h1>
        {person.name} - {person.jobTitle}
      </h1>
      <p>{person.summary}</p>
      <p>
        {person.jobTitle} at {person.employer.name}, based in {person.location}. {person.education.degree},{" "}
        {person.education.school} ({person.education.detail}).
      </p>
      <h2>Currently</h2>
      <ul>
        {siteContent.currently.map((c) => (
          <li key={c.kind}>
            {c.kind}: {c.value}
          </li>
        ))}
      </ul>
      <h2>Stack</h2>
      <p>{siteContent.stack.join(", ")}</p>
      <h2>Featured project: {siteContent.featured.name}</h2>
      <p>{siteContent.featured.summary}</p>
      <h2>Experience</h2>
      <ExperienceList />
      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <a href="/projects">{p.title}</a>: {p.description}
          </li>
        ))}
      </ul>
      <Links />
    </>
  )
}

function About() {
  return (
    <>
      <h1>About {person.name}</h1>
      <p>{person.summary}</p>
      <h2>Experience</h2>
      <ExperienceList />
      <h2>Education</h2>
      <p>
        {person.education.degree}, {person.education.school}. {person.education.detail}.
      </p>
      <h2>Skills</h2>
      <dl>
        {Object.entries(skills).map(([group, list]) => (
          <div key={group}>
            <dt>{skillLabels[group as SkillGroup]}</dt>
            <dd>{list.join(", ")}</dd>
          </div>
        ))}
      </dl>
      <h2>Leadership</h2>
      <ul>
        {leadership.map((l) => (
          <li key={l.org}>
            {l.role}, {l.org}: {l.description}
          </li>
        ))}
      </ul>
      <h2>Achievements</h2>
      <ul>
        {achievements.map((a) => (
          <li key={a.title}>
            {a.title} ({a.place}): {a.description}
          </li>
        ))}
      </ul>
      <h2>Coding profiles</h2>
      <p>
        {siteContent.stats.leetcode} problems solved on LeetCode, {siteContent.stats.repos} repositories on GitHub.
      </p>
      <Links />
    </>
  )
}

function Projects() {
  return (
    <>
      <h1>Projects by {person.name}</h1>
      {projects.map((p) => (
        <section key={p.id}>
          <h2>{p.title}</h2>
          <p>{p.date}</p>
          <p>{p.longDescription}</p>
          <p>Built with {p.tech.join(", ")}.</p>
          {p.github && <a href={p.github}>Source code on GitHub</a>}
          {p.demo && <a href={p.demo}>Live demo</a>}
        </section>
      ))}
    </>
  )
}

function Blog({ posts }: { posts: MediumPost[] }) {
  return (
    <>
      <h1>{person.name}&apos;s Blog</h1>
      <p>Writing on AI engineering, cloud, Linux and learning to code, published on Medium.</p>
      {posts.map((p) => (
        <section key={p.id}>
          <h2>
            <a href={p.url}>{p.title}</a>
          </h2>
          <p>
            <time dateTime={p.date}>{p.date}</time> · {p.readMinutes} min read
          </p>
          <p>{p.excerpt}</p>
        </section>
      ))}
      <a href={person.profiles.medium}>All stories on Medium</a>
    </>
  )
}

function Interests() {
  return (
    <>
      <h1>{person.name}&apos;s Interests</h1>
      <p>Saved reading and watching: the blogs, articles and videos Ashish recommends.</p>
      <ul>
        {siteContent.interests.map((i) => (
          <li key={i.id}>
            <a href={i.url}>{i.title}</a> by {i.author} ({i.type})
          </li>
        ))}
      </ul>
      <p>Outside work: movies, books and pop culture, music, starting new tech projects, and games.</p>
    </>
  )
}

function Contact() {
  return (
    <>
      <h1>Contact {person.name}</h1>
      <p>{siteContent.status}. The quickest way to reach Ashish is by email or on LinkedIn.</p>
      <Links />
    </>
  )
}

function ExperienceList() {
  return (
    <ul>
      {experience.map((e) => (
        <li key={e.role}>
          {e.role}, {e.company} ({e.dates}): {e.description}
        </li>
      ))}
    </ul>
  )
}

function Links() {
  return (
    <ul>
      <li>
        Email: <a href={`mailto:${person.email}`}>{person.email}</a>
      </li>
      <li>
        <a href={person.profiles.linkedin}>LinkedIn</a>
      </li>
      <li>
        <a href={person.profiles.github}>GitHub</a>
      </li>
      <li>
        <a href={person.profiles.leetcode}>LeetCode</a>
      </li>
      <li>
        <a href={person.profiles.medium}>Medium</a>
      </li>
    </ul>
  )
}
