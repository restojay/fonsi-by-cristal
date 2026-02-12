import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    strictNullChecks: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
