import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AlphaGrow',
    short_name: 'AlphaGrow',
    description: 'Smart financial tools for Malaysian micro-merchants',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0D2B6E',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
