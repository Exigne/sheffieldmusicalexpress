import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ensure 'output: export' is NOT here
  typescript: {
    ignoreBuildErrors: true, 
  },
  images: {
    unoptimized: true,
  }
}

export default nextConfig
