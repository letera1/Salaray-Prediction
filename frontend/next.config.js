/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://backend:8000/:path*`,
      },
    ];
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;