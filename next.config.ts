/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // Enable static export
  distDir: 'dist',         // Output to 'dist' folder for Netlify
  images: {
    unoptimized: true,     // Required for static export
  },
}

module.exports = nextConfig
