/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Experimental özellikler
  experimental: {
    // Source map optimizasyonu
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
