const PROJECTS = [
  {
    title: "StoryMail",
    category: "AI",
    date: "Mar 2024 – Oct 2024",
    description: "AI-powered platform for email classification, weekly digests, and natural-language querying.",
    tech: ["Django", "Auth0", "PostgreSQL", "GeminiAPI"],
    github: "https://github.com/ashish-nagmoti/storymail",
    demo: "http://story-mail-olive.vercel.app/",
  },
  {
    title: "KalaShala",
    category: "Web",
    date: "Feb 2024 – Mar 2024",
    description: "Platform empowering local artists to showcase, publish content, and grow their audience.",
    tech: ["Django", "AWS", "PostgreSQL"],
    github: "https://github.com/ashish-nagmoti/kalashala-backend",
    demo: "https://kalashala-frontend1-zxra.vercel.app/",
  },
  {
    title: "AceUp",
    category: "AI",
    date: "2024",
    description: "Student resource hub with notes, roadmaps, events, and an integrated AI chatbot.",
    tech: ["Django", "Tailwind CSS", "Jinja", "SQLite3"],
    github: "https://github.com/riaan-attar/AceUp",
    demo: "https://inevitable-lucky-predeator-b19e8de5.koyeb.app/",
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-24 px-4 border-t border-[var(--phosphor)]/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold glow mb-8">$ ls -la ~/projects</h2>

        <div className="space-y-6">
          {PROJECTS.map((p) => (
            <div key={p.title} className="border border-[var(--phosphor)]/25 hover:border-[var(--phosphor)] transition-colors p-5">
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h3 className="font-bold text-[var(--phosphor)]">[ {p.title} ]</h3>
                <span className="text-xs text-[var(--dim)] shrink-0">{p.category}</span>
              </div>
              <p className="text-xs text-[var(--dim)] mb-3">{p.date}</p>
              <p className="text-sm text-[var(--dim)] mb-3 leading-relaxed">{p.description}</p>
              <p className="text-xs text-[var(--dim)] mb-4">
                tech: <span className="text-[var(--phosphor)]/80">{p.tech.join(", ")}</span>
              </p>
              <div className="flex gap-4 text-sm">
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="hover:glow hover:underline">
                  [ github ]
                </a>
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noopener noreferrer" className="hover:glow hover:underline">
                    [ live demo ]
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
