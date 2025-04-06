/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/cryptoweather' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/cryptoweather/' : '',
};

module.exports = nextConfig; 