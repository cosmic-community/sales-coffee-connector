/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.cosmicjs.com'],
  },
  // Ensure proper handling of dynamic routes
  experimental: {
    serverComponentsExternalPackages: ['@cosmicjs/sdk']
  }
}

module.exports = nextConfig