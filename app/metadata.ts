import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ashish Nagmoti | AI & Data Science Student | Backend & Cloud Developer',
  description: 'Ashish Nagmoti is an AI and Data Science student with expertise in backend development, AI integration, and cloud infrastructure.',
  keywords: ['Ashish Nagmoti', 'AI Student', 'Data Science', 'Backend Developer', 'Cloud Developer', 'Portfolio', 'Python', 'Django', 'AI Engineer'],
  openGraph: {
    title: 'Ashish Nagmoti | AI & Data Science Portfolio',
    description: 'Personal portfolio showcasing AI, backend development, and cloud computing projects.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/og-image.svg', // Replace with actual PNG when converted
        width: 1200,
        height: 630,
        alt: 'Ashish Nagmoti - AI & Data Science Student',
      }
    ],
  },
};
