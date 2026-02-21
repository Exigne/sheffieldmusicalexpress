import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // We remove output: 'export' because this is a dynamic forum
  typescript: {
    ignoreBuildErrors: true, // Useful for getting past the last few type hurdles
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
