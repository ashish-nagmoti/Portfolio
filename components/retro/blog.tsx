const POSTS = [
  {
    title: "Common Pitfalls While Setting Up an AWS Account",
    date: "2025-07-28",
    readTime: "4 min",
    tags: ["AWS", "Cloud"],
    url: "https://medium.com/@ashishnagmoti7/common-pitfalls-while-setting-up-an-aws-account-b2767d9dde5b",
  },
  {
    title: "I switched to Arch Linux",
    date: "2024-01-30",
    readTime: "5 min",
    tags: ["Linux", "Arch"],
    url: "https://medium.com/@ashishnagmoti7/i-switched-to-arch-linux-cca16df9c2a7",
  },
  {
    title: "My CS50 experience",
    date: "2024-06-21",
    readTime: "6 min",
    tags: ["CS50", "Learning"],
    url: "https://medium.com/long-sweet-valuable/my-cs50-experience-44b5b8826c4d",
  },
  {
    title: "My Hacktoberfest Journey",
    date: "2023-11-08",
    readTime: "4 min",
    tags: ["Hacktoberfest", "Open Source"],
    url: "https://medium.com/@ashishnagmoti7/my-hacktoberfest-journey-navigating-challenges-and-embracing-growth-14d6faf8649b",
  },
]

export function Blog() {
  return (
    <section id="blog" className="py-24 px-4 border-t border-[var(--phosphor)]/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold glow mb-8">$ cat blog/*.md</h2>

        <div className="space-y-5">
          {POSTS.map((post) => (
            <a
              key={post.title}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-b border-[var(--phosphor)]/15 pb-5"
            >
              <p className="font-semibold group-hover:glow group-hover:underline mb-1">&gt; {post.title}</p>
              <p className="text-xs text-[var(--dim)]">
                {post.date} · {post.readTime} read ·{" "}
                {post.tags.map((t) => `[${t}]`).join(" ")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
