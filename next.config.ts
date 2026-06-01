import { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  serverExternalPackages: ['mailgun.js'],
  // API proxy is now handled by middleware.ts. This avoids interfering with local internal /api routes.
  experimental: {
    imgOptTimeoutInSeconds: 30,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dreamazebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev-api.dreamazebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-8cae259c4f3f4e73adf6a65ae6bbd7fa.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-276765949af547aba1ca5c576f2859ea.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pro-s3-dre01.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3-dev-dre01.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3-pro-dre001.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3-pro-dre002.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-9cf31543472247c2936bb3ad6524d445.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
 
export default nextConfig;
