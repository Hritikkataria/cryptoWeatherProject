/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['assets.coingecko.com'], // Add any image domains you're using
  },
  basePath: process.env.NODE_ENV === 'production' ? '/cryptoWeather-master' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cryptoWeather-master/' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 