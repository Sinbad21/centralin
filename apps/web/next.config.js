/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@chatbot-platform/auth', '@chatbot-platform/database'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
