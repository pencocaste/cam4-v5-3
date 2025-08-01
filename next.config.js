/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600, // 1 hour cache
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'snapshots.xcdnpro.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cam4-static-test.xcdnpro.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cam4-images.xcdnpro.com',
        pathname: '/**',
      }
    ],
    unoptimized: false, // Enable Next.js image optimization
    loader: 'default',
    domains: [], // Deprecated in favor of remotePatterns
  }
}

module.exports = nextConfig