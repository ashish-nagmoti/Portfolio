"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"

const blogPosts = [
	{
		id: 1,
		title: "I switched to Arch Linux",
		excerpt:
			"Here I showcase my journey from Windows to Arch Linux and the problems I had in journey.",
		date: "2024-01-30",
		readTime: "5 min read",
		url: "https://medium.com/@ashishnagmoti7/i-switched-to-arch-linux-5feede3d9c1c",
		tags: ["Linux", "Journey", "Arch"],
	},
	{
		id: 2,
		title: "My CS50 experience",
		excerpt: "My experience and learnings from the CS50 course.",
		date: "2024-06-21",
		readTime: "6 min read",
		url: "https://medium.com/@ashishnagmoti7/my-cs50-experience-abc123", // Replace with actual slug if available
		tags: ["CS50", "Learning", "Programming"],
	},
	{
		id: 3,
		title: "My Hacktoberfest Journey: Navigating Challenges and Embracing Growth",
		excerpt:
			"My Hacktoberfest Journey: Navigating Challenges and Embracing Growth.",
		date: "2023-11-08",
		readTime: "4 min read",
		url: "https://medium.com/@ashishnagmoti7/my-hacktoberfest-journey-navigating-challenges-and-embracing-growth-xyz456", // Replace with actual slug if available
		tags: ["Hacktoberfest", "Open Source", "Growth"],
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

export default function Blog() {
	return (
		<div className="min-h-screen pt-16">
			<div className="container mx-auto px-4 py-20">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="max-w-4xl mx-auto"
				>
					{/* Header */}
					<motion.div variants={itemVariants} className="text-center mb-16">
						<h1 className="text-4xl font-bold mb-4">Blog</h1>
						<p className="text-xl text-muted-foreground">
							Thoughts on AI, backend development, and cloud architecture.
						</p>
					</motion.div>

					{/* Blog Posts */}
					<div className="space-y-8">
						{blogPosts.map((post) => (
							<motion.div
								key={post.id}
								variants={itemVariants}
								whileHover={{ y: -2 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<Card className="group cursor-pointer">
									<CardHeader>
										<div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
											<div className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												{new Date(post.date).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</div>
											<div className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												{post.readTime}
											</div>
										</div>
										<CardTitle className="group-hover:text-primary transition-colors">
											{post.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-4">
											{post.excerpt}
										</p>
										<div className="flex items-center justify-between">
											<div className="flex flex-wrap gap-2">
												{post.tags.map((tag) => (
													<Badge key={tag} variant="secondary">
														{tag}
													</Badge>
												))}
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="group/btn"
												asChild
											>
												<a href={post.url} target="_blank" rel="noopener noreferrer">
													Read More
													<ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
												</a>
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>

					{/* Coming Soon */}
					<motion.div
						variants={itemVariants}
						className="text-center mt-16 p-8 border-2 border-dashed border-muted rounded-lg"
					>
						<h3 className="text-xl font-semibold mb-2">
							More Posts Coming Soon
						</h3>
						<p className="text-muted-foreground">
							I'm working on more in-depth articles about AI engineering, cloud
							architecture, and backend development.
						</p>
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}
