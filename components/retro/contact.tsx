"use client"

import { useState } from "react"

const EMAIL = "ashishnagmoti2310@gmail.com"

const LINES: [string, string, string][] = [
  ["email", EMAIL, `mailto:${EMAIL}`],
  ["linkedin", "linkedin.com/in/ashish-nagmoti", "https://www.linkedin.com/in/ashish-nagmoti-54269b249"],
  ["github", "github.com/ashish-nagmoti", "https://github.com/ashish-nagmoti"],
  ["blog", "medium.com/@ashishnagmoti7", "https://medium.com/@ashishnagmoti7"],
]

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable, ignore
    }
  }

  return (
    <section id="contact" className="py-24 px-4 border-t border-[var(--phosphor)]/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold glow mb-8">$ cat contact.txt</h2>

        <div className="space-y-1 mb-8 text-sm">
          {LINES.map(([label, value, href]) => (
            <div key={label} className="flex flex-wrap items-baseline gap-3 border-b border-[var(--phosphor)]/10 py-2.5">
              <span className="text-[var(--phosphor)] w-20 shrink-0">{label}:</span>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--dim)] hover:text-[var(--phosphor)] hover:underline">
                {value}
              </a>
              {label === "email" && (
                <button onClick={copyEmail} className="text-xs text-[var(--dim)] hover:text-[var(--phosphor)] ml-auto">
                  [ {copied ? "copied!" : "copy"} ]
                </button>
              )}
            </div>
          ))}
          <div className="flex flex-wrap items-baseline gap-3 py-2.5">
            <span className="text-[var(--phosphor)] w-20 shrink-0">status:</span>
            <span className="text-[var(--dim)]">open to work (remote/onsite), UTC+5:30</span>
          </div>
        </div>

        <a
          href={`mailto:${EMAIL}`}
          className="inline-block border border-[var(--phosphor)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--phosphor)] hover:text-[var(--bg)] transition-colors"
        >
          [ send email ]
        </a>
      </div>
    </section>
  )
}
