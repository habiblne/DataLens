import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DataLens — AI CSV Analysis & Insights',
    short_name: 'DataLens',
    description: 'Ask your data anything. AI-powered CSV analysis with instant answers, charts, and insights.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#10b981',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
