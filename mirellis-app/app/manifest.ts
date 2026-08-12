import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mirellis After Work',
    short_name: 'Mirellis',
    description: 'A 21-day, local-first practice for ending work clearly and beginning the evening.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e8',
    theme_color: '#f6f1e8',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
