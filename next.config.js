/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
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