const STATS: [string, string][] = [
  ["education", "K.K. Wagh IEER (9.1 CGPA)"],
  ["experience", "Freelancing & Internships"],
  ["focus", "Backend + AI"],
  ["location", "Nashik, India"],
  ["leetcode", "100+ problems solved"],
  ["github", "50+ repositories"],
  ["interests", "coffee, lo-fi beats, Arch Linux tinkering"],
]

const SKILLS: Record<string, string[]> = {
  backend: ["Python", "Django", "FastAPI", "REST APIs"],
  cloud: ["AWS", "GCP"],
  databases: ["PostgreSQL", "MongoDB", "S3"],
  "ai/ml": ["LLM Integration", "Gemini API", "Langchain", "Vector DBs"],
}

export function About() {
  return (
    <section id="about" className="py-24 px-4 border-t border-[var(--phosphor)]/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold glow mb-8">$ cat about.txt</h2>

        <p className="text-[var(--dim)] leading-relaxed mb-10">
          An adaptable and passionate AI and Data Science student. I love building impactful full-stack
          applications, with a strong focus on backend development, AI integration, and cloud infrastructure. From
          winning coding competitions to leading club events and building open-source projects, I enjoy turning
          ideas into usable tech.
        </p>

        <div className="grid sm:grid-cols-2 gap-y-2 gap-x-6 mb-12 text-sm">
          {STATS.map(([k, v]) => (
            <div key={k} className="flex gap-3 border-b border-[var(--phosphor)]/10 py-2">
              <span className="text-[var(--phosphor)] w-24 shrink-0">{k}:</span>
              <span className="text-[var(--dim)]">{v}</span>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-[var(--phosphor)] mb-4">$ ls skills/</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(SKILLS).map(([category, list]) => (
            <div key={category} className="border border-[var(--phosphor)]/20 p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--dim)] mb-2">{category}</p>
              <ul className="space-y-1 text-sm">
                {list.map((skill) => (
                  <li key={skill}>
                    <span className="text-[var(--phosphor)]">[x]</span> {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
