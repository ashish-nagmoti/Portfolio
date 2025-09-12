"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExternalLink, Github, Code, Cloud, Brain, Smartphone, Globe } from "lucide-react"

const projects = [
	{
		id: 1,
		title: "StoryMail – AI-Powered Smart Email Platform",
		description: "AI platform for email classification, weekly digests, and querying.",
		longDescription:
			"StoryMail is an AI-powered platform that classifies emails, generates weekly digests, and allows users to query their inbox using natural language. Built with Django, Auth0, Postgres SQL, and GeminiAPI for robust authentication and advanced AI features.",
		tech: ["Django", "Auth0", "Postgres SQL", "GeminiAPI"],
		category: "AI",
		icon: Brain,
		github: "https://github.com/ashish-nagmoti/storymail", // Update with actual repo if available
		demo: "http://story-mail-olive.vercel.app/",
		image: "https://story-mail-olive.vercel.app/og.png",
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
		icon: Globe,
		github: "https://github.com/ashish-nagmoti/kalashala-backend", // Update with actual repo if available
		demo: "https://kalashala-frontend1-zxra.vercel.app/",
		image: "/placeholder.svg?height=200&width=400",
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
		icon: Code,
		github: "https://github.com/riaan-attar/AceUp", // Update with actual repo if available
		demo: "https://inevitable-lucky-predeator-b19e8de5.koyeb.app/",
		image: "/placeholder.svg?height=200&width=400",
		date: "2024",
	},
]

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
}

export default function Projects() {
	const [selectedCategory, setSelectedCategory] = useState("All")

	const filteredProjects = projects

	return (
		<div className="min-h-screen pt-16">
			<div className="container mx-auto px-4 py-20">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="max-w-6xl mx-auto"
				>
					{/* Header */}
					<motion.div variants={itemVariants} className="text-center mb-16">
						<h1 className="text-4xl font-bold mb-4">Projects</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							A showcase of my work in AI, cloud computing, and full-stack development.
						</p>
					</motion.div>

					{/* Projects Grid */}
					<motion.div
						variants={containerVariants}
						className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
					>
						{filteredProjects.map((project) => (
							<motion.div
								key={project.id}
								variants={itemVariants}
								whileHover={{ y: -8, scale: 1.04 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<Card className="h-full group cursor-pointer overflow-hidden bg-neutral-900 border border-neutral-700 shadow-xl relative rounded-2xl hover:shadow-neutral-800 transition-all duration-300">
									<div className="absolute top-4 right-4 z-10">
										<Badge variant="secondary" className="bg-neutral-800 text-white text-xs px-3 py-1 rounded-full shadow">{project.category}</Badge>
									</div>
									<div className="flex flex-col items-center justify-center py-10 gap-4 px-4">
										<div className="rounded-full bg-neutral-800 p-5 mb-2 shadow-lg border-4 border-neutral-900">
											<project.icon className="h-12 w-12 text-gray-300 drop-shadow" />
										</div>
										<h2 className="text-lg font-extrabold text-white text-center mb-1 leading-tight">{project.title}</h2>
										<p className="text-xs text-gray-400 font-semibold mb-1 tracking-wide">{project.date}</p>
										<p className="text-sm text-gray-300 text-center mb-2 leading-relaxed">{project.description}</p>
										<div className="flex flex-wrap justify-center gap-2 mb-2">
											{project.tech.map((tech) => (
												<Badge key={tech} variant="outline" className="text-xs border-gray-600 text-gray-300 bg-neutral-800 px-2 py-1">
													{tech}
												</Badge>
											))}
										</div>
										<div className="flex gap-2 justify-center mt-2">
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="outline" size="sm" className="bg-neutral-800 border-neutral-600 text-gray-300 hover:bg-neutral-700">
														<Code className="h-4 w-4 mr-2" />
														Details
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-2xl bg-neutral-900 border-neutral-700">
													<DialogHeader>
														<DialogTitle className="flex items-center gap-2 text-gray-300">
															<project.icon className="h-5 w-5" />
															{project.title}
														</DialogTitle>
													</DialogHeader>
													<div className="space-y-4">
														<p className="text-gray-300">{project.longDescription}</p>
														<div>
															<h4 className="font-semibold mb-2 text-gray-400">Technologies Used:</h4>
															<div className="flex flex-wrap gap-2">
																{project.tech.map((tech) => (
																	<Badge key={tech} variant="secondary" className="bg-neutral-800 text-white">
																		{tech}
																	</Badge>
																))}
															</div>
														</div>
														<div className="flex gap-2">
															<Button asChild className="bg-neutral-800 text-white">
																<a
																	href={project.github}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<Github className="h-4 w-4 mr-2" />
																	GitHub
																</a>
															</Button>
															{project.demo && project.demo !== "#" && (
																<Button variant="outline" asChild className="border-neutral-600 text-gray-300 hover:bg-neutral-700">
																	<a
																		href={project.demo}
																		target="_blank"
																		rel="noopener noreferrer"
																	>
																		<ExternalLink className="h-4 w-4 mr-2" />
																		Live Demo
																	</a>
																</Button>
															)}
														</div>
													</div>
												</DialogContent>
											</Dialog>
											<Button variant="ghost" size="sm" asChild className="hover:bg-neutral-800">
												<a
													href={project.github}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Github className="h-4 w-4 text-gray-400" />
												</a>
											</Button>
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}
