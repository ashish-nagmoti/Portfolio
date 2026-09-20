'use client';

import { useEffect } from 'react';

export default function JsonLd() {
  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Ashish Nagmoti',
        url: 'https://ashish-nagmoti.tech',
        image: 'https://ashish-nagmoti.tech/profile-image.jpg', // Update with your actual profile image
        jobTitle: 'AI Engineer & Researcher',
        worksFor: {
          '@type': 'Organization',
          name: 'ESDS Software Solution Ltd.'
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'K.K. Wagh Institute of Engineering Education and Research'
        },
        description:
          'AI Engineer and Researcher working on LLM inference, AI infrastructure, sovereign AI, RAG, GPU infrastructure, AI security and enterprise AI platforms.',
        email: 'mailto:ashishnagmoti2310@gmail.com',
        sameAs: [
          'https://github.com/ashish-nagmoti',
          'https://www.linkedin.com/in/ashish-nagmoti-54269b249',
          'https://leetcode.com/u/ashish_nagmoti/',
          'https://medium.com/@ashishnagmoti7'
        ],
        knowsAbout: [
          'Large Language Models',
          'LLM Inference',
          'AI Infrastructure',
          'GPU Computing',
          'Kubernetes',
          'Retrieval-Augmented Generation',
          'Sovereign AI',
          'AI Security',
          'Python',
          'FastAPI',
          'AWS',
          'GCP'
        ]
      });
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
