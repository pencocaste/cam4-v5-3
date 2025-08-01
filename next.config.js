/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    // Optimize image caching
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Image domains
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
    unoptimized: true
  }
}

module.exports = nextConfig