/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 