import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@hugeicons/react', 'radix-ui'],
  },
}

export default nextConfig
