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
        url: 'https://ashishnagmoti.com',
        image: 'https://ashishnagmoti.com/profile-image.jpg', // Update with your actual profile image
        jobTitle: 'AI & Data Science Student | Backend & Cloud Developer',
        worksFor: {
          '@type': 'Organization',
          name: 'K.K. Wagh Institute of Engineering Education and Research'
        },
        description: 'AI and Data Science student with expertise in backend development and cloud technologies.',
        sameAs: [
          'https://github.com/ashish-nagmoti',
          // Add other social media links
        ],
        knowsAbout: [
          'Artificial Intelligence',
          'Machine Learning',
          'Backend Development',
          'Cloud Computing',
          'Python',
          'Django',
          'AWS',
          'GCP'
        ]
      });
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
