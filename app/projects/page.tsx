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
		demo: "#",
		image: "/placeholder.svg?height=200&width=400",
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
		github: "https://github.com/ashish-nagmoti/kalashala", // Update with actual repo if available
		demo: "#",
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
		github: "https://github.com/ashish-nagmoti/aceup", // Update with actual repo if available
		demo: "#",
		image: "/placeholder.svg?height=200&width=400",
		date: "2024",
	},
]

const categories = ["All", "AI", "Cloud", "Frontend", "Mobile"]

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

	const filteredProjects =
		selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory)

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

					{/* Category Filter */}
					<motion.div variants={itemVariants} className="flex justify-center mb-12">
						<div className="flex flex-wrap gap-2">
							{categories.map((category) => (
								<Button
									key={category}
									variant={selectedCategory === category ? "default" : "outline"}
									onClick={() => setSelectedCategory(category)}
									className="mb-2"
								>
									{category}
								</Button>
							))}
						</div>
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
								whileHover={{ y: -5 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<Card className="h-full group cursor-pointer overflow-hidden">
									<div className="relative overflow-hidden">
										<img
											src={project.image || "/placeholder.svg"}
											alt={project.title}
											className="w-full h-48 object-cover transition-transform group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
											<project.icon className="h-12 w-12 text-white" />
										</div>
									</div>

									<CardHeader>
										<CardTitle className="flex items-center justify-between">
											<span>{project.title}</span>
											<Badge variant="secondary">{project.category}</Badge>
										</CardTitle>
									</CardHeader>

									<CardContent className="flex-1 flex flex-col">
										<p className="text-muted-foreground mb-4 flex-1">{project.description}</p>

										<div className="flex flex-wrap gap-1 mb-4">
											{project.tech.slice(0, 3).map((tech) => (
												<Badge key={tech} variant="outline" className="text-xs">
													{tech}
												</Badge>
											))}
											{project.tech.length > 3 && (
												<Badge variant="outline" className="text-xs">
													+{project.tech.length - 3}
												</Badge>
											)}
										</div>

										<div className="flex gap-2">
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant="outline"
														size="sm"
														className="flex-1 bg-transparent"
													>
														<Code className="h-4 w-4 mr-2" />
														Details
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-2xl">
													<DialogHeader>
														<DialogTitle className="flex items-center gap-2">
															<project.icon className="h-5 w-5" />
															{project.title}
														</DialogTitle>
													</DialogHeader>
													<div className="space-y-4">
														<img
															src={project.image || "/placeholder.svg"}
															alt={project.title}
															className="w-full h-48 object-cover rounded-lg"
														/>
														<p className="text-muted-foreground">
															{project.longDescription}
														</p>
														<div>
															<h4 className="font-semibold mb-2">
																Technologies Used:
															</h4>
															<div className="flex flex-wrap gap-2">
																{project.tech.map((tech) => (
																	<Badge key={tech} variant="secondary">
																		{tech}
																	</Badge>
																))}
															</div>
														</div>
														<div className="flex gap-2">
															<Button asChild>
																<a
																	href={project.github}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<Github className="h-4 w-4 mr-2" />
																	GitHub
																</a>
															</Button>
															<Button variant="outline" asChild>
																<a
																	href={project.demo}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	<ExternalLink className="h-4 w-4 mr-2" />
																	Live Demo
																</a>
															</Button>
														</div>
													</div>
												</DialogContent>
											</Dialog>

											<Button variant="ghost" size="sm" asChild>
												<a
													href={project.github}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Github className="h-4 w-4" />
												</a>
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}
