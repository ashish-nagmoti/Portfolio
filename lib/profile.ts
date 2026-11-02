/*
 * The facts about Ashish that more than one place shows: the About and
 * Projects apps, and the plain-text version of each page that search engines
 * read (components/seo). Plain data, so server components can use it too.
 */

export const SITE_URL = "https://ashish-nagmoti.tech"

export const person = {
  name: "Ashish Nagmoti",
  givenName: "Ashish",
  familyName: "Nagmoti",
  jobTitle: "AI Engineer & Researcher",
  employer: { name: "ESDS Software Solution Ltd.", url: "https://www.esds.co.in" },
  location: "Maharashtra, India",
  email: "ashishnagmoti2310@gmail.com",
  resume: "/Ashish_Nagmoti_Resume.pdf",
  summary:
    "Ashish Nagmoti is an AI Engineer and Researcher at ESDS Software Solution Ltd. He builds production AI systems: LLM inference and model serving, GPU infrastructure, Kubernetes-based AI workloads, retrieval-augmented generation (RAG), AI agents, AI security and governance, and sovereign AI architectures, with a focus on making AI reliable, scalable, secure and practical for enterprises.",
  education: {
    degree: "B.Tech, Artificial Intelligence & Data Science",
    school: "K.K. Wagh Institute of Engineering Education and Research",
    detail: "Class of 2026 · 9.1 CGPA",
  },
  profiles: {
    github: "https://github.com/ashish-nagmoti",
    linkedin: "https://www.linkedin.com/in/ashish-nagmoti-54269b249",
    leetcode: "https://leetcode.com/u/ashish_nagmoti/",
    medium: "https://medium.com/@ashishnagmoti7",
  },
}

export const skills = {
  llm: ["LLM Inference", "vLLM", "KServe", "Hugging Face", "RAG", "Vector Search", "AI Agents", "LLM Routing"],
  infra: ["Kubernetes", "NVIDIA GPUs", "CUDA", "Kubeflow", "Model Registries", "ML Pipelines", "AI Observability"],
  backend: ["Python", "FastAPI", "Django", "REST APIs"],
  frontend: ["React", "Next.js", "TypeScript"],
  cloud: ["AWS", "GCP", "Docker", "Linux"],
  databases: ["PostgreSQL", "MongoDB", "Qdrant"],
}

export type SkillGroup = keyof typeof skills

export const skillLabels: Record<SkillGroup, string> = {
  llm: "Generative AI & LLMs",
  infra: "AI Infrastructure",
  backend: "Backend",
  frontend: "Frontend",
  cloud: "Cloud",
  databases: "Databases",
}

export const experience = [
  {
    role: "AI Engineer & Researcher",
    company: "ESDS Software Solution Ltd.",
    dates: "Present",
    description:
      "AI infrastructure and enterprise AI platforms: LLM inference and model serving, GPU infrastructure, Kubernetes-based AI workloads, RAG, AI agents and AgentOps, AI security and governance, sovereign AI architectures.",
  },
  {
    role: "Backend Intern",
    company: "PrimeAcademy - Remote",
    dates: "Mar 2025 – Aug 2025",
    description: "Worked on backend using Django and AWS deployment.",
  },
  {
    role: "Technical Intern",
    company: "Lead Cured - Remote",
    dates: "Sep 2024 – Nov 2024",
    description: "Built and tested serverless APIs using AWS Lambda, EC2, S3, IAM.",
  },
]

export const leadership = [
  {
    org: "KAVACH - Team Patronus",
    role: "CEO & CTO",
    description:
      "Led the technical and product direction of KAVACH, an LLM Security Platform for enterprise LLM security and governance. 1st place at Sharp Tank, ESDS Software Solution Ltd.",
  },
  {
    org: "Phoenix Club",
    role: "Vice President",
    description: "Leading technical initiatives and organizing tech events for 200+ members.",
  },
  {
    org: "Innovera Hackathon",
    role: "Web and IT Head",
    description: "Managed a team of 10+ people for building the website and running technical aspects of the hackathon.",
  },
  {
    org: "Young Indians Nashik Chapter",
    role: "Student Coordinator (Innovation)",
    description: "Driving innovation projects and mentoring emerging entrepreneurs.",
  },
]

export const achievements = [
  {
    title: "Sharp Tank, ESDS Software Solution Ltd.",
    place: "1st Place",
    description: "Won as part of Team Patronus for KAVACH, an LLM Security Platform, contributing as CEO & CTO.",
  },
  {
    title: "Certificate of Excellence - Transformation & Change Drive",
    place: "ESDS Software Solution Ltd.",
    description: "Recognition for contributions toward organizational transformation and change initiatives.",
  },
  { title: "Codethon – Arambh", place: "Winner (1st place)", description: "Coding competition winner for innovative solutions." },
  { title: "Code-O-Fiesta 2.0", place: "3rd Place", description: "Placed 3rd in a competitive coding event." },
  { title: "Social Winter of Code", place: "Contributor", description: "Completed open-source contributions under SWOC." },
]

export type ProjectIcon = "shield" | "brain" | "boxes" | "globe" | "code"

export interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  tech: string[]
  category: "AI" | "Web" | "Tools"
  icon: ProjectIcon
  github: string | null
  demo: string | null
  date: string
}

export const projects: Project[] = [
  {
    id: 6,
    title: "KAVACH – LLM Security Platform",
    description: "Enterprise LLM security and governance. 1st place at Sharp Tank, ESDS.",
    longDescription:
      "KAVACH is an LLM Security Platform focused on enterprise LLM security, governance, and protecting AI systems and sensitive organizational data. Built by Team Patronus - Ashish Nagmoti, Sakshi Yeole, Akshada Malode, Avani Jethiwal, Krushna Malwatkar and Kaustubh Chaudhari - with Ashish as CEO & CTO, responsible for the technical and product direction. Presented at Sharp Tank at ESDS Software Solution Ltd., where it won 1st place.",
    tech: ["LLM Security", "AI Governance", "Access Control", "Enterprise AI"],
    category: "AI",
    icon: "shield",
    github: null,
    demo: null,
    date: "Sharp Tank, ESDS - 1st Place",
  },
  {
    id: 5,
    title: "SovereignRAG – Decentralized Enterprise AI",
    description: "Enterprise RAG where sensitive data never leaves the team that owns it.",
    longDescription:
      "An architecture for decentralized enterprise RAG in which sensitive data stays at its source. Each organizational node keeps its own documents, vector database, retrieval, access policies and cryptographic identity. Instead of moving documents or embeddings between departments, nodes release signed claims according to locally enforced policy - so the orchestration layer, and the LLM itself, are never trusted with raw sensitive data. Built for the ESDS Swaraj CloudForge Hackathon 2026 by Team Patronus.",
    tech: ["Python", "FastAPI", "PostgreSQL", "Qdrant", "Ed25519", "vLLM", "React"],
    category: "AI",
    icon: "brain",
    github: null,
    demo: null,
    date: "2026",
  },
  {
    id: 4,
    title: "System Map – Isometric Codebase Visualizer",
    description: "Turns any codebase into an interactive isometric blueprint diagram.",
    longDescription:
      "A Claude Code skill that reads a codebase and renders its real routes, functions, models and tables as an interactive isometric blueprint - cross-hatched cubes on a technical-drawing canvas. Every number is pulled from source, never invented; click any block to drill into its actual internals. Outputs a single self-contained HTML file with no server or build step.",
    tech: ["Claude Code", "HTML", "SVG", "JavaScript"],
    category: "Tools",
    icon: "boxes",
    github: "https://github.com/ashish-nagmoti/codebase-isometric-visualizer",
    demo: null,
    date: "Aug 2026",
  },
  {
    id: 1,
    title: "StoryMail – AI-Powered Smart Email Platform",
    description: "AI platform for email classification, weekly digests, and querying.",
    longDescription:
      "StoryMail is an AI-powered platform that classifies emails, generates weekly digests, and allows users to query their inbox using natural language. Built with Django, Auth0, Postgres SQL, and GeminiAPI for robust authentication and advanced AI features.",
    tech: ["Django", "Auth0", "Postgres SQL", "GeminiAPI"],
    category: "AI",
    icon: "brain",
    github: "https://github.com/ashish-nagmoti/storymail",
    demo: "http://story-mail-olive.vercel.app/",
    date: "Mar 2024 – Oct 2024",
  },
  {
    id: 2,
    title: "KalaShala – Platform Empowering Local Artists",
    description: "Platform for local artists to showcase, publish content, and grow.",
    longDescription:
      "KalaShala is a platform designed for local artists to showcase their work, publish content, and grow their audience. Role: Backend Development and Deployment.",
    tech: ["Django", "AWS", "Postgres SQL"],
    category: "Web",
    icon: "globe",
    github: "https://github.com/ashish-nagmoti/kalashala-backend",
    demo: "https://kalashala-frontend1-zxra.vercel.app/",
    date: "Feb 2024 – Mar 2024",
  },
  {
    id: 3,
    title: "AceUp – Student Resource Hub with AI Chatbot",
    description: "Student hub with notes, roadmaps, events, and chatbot.",
    longDescription:
      "AceUp is a student resource hub featuring notes, roadmaps, events, and an integrated AI chatbot. Built using Django, Tailwind CSS, Jinja, SQLite3, and Python.",
    tech: ["Django", "Tailwind CSS", "Jinja", "SQLite3", "Python"],
    category: "AI",
    icon: "code",
    github: "https://github.com/riaan-attar/AceUp",
    demo: "https://inevitable-lucky-predeator-b19e8de5.koyeb.app/",
    date: "2024",
  },
]
