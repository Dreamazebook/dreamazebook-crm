/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 在构建时忽略ESLint错误，包括未使用的变量
    ignoreDuringBuilds: true,
  },
  images: {
    // 使用 domains 配置（简单方式）
    domains: ['dreamazebook.com', 'api.dreamazebook.com', 'dev-api.dreamazebook.com', '54.196.149.18', 'pub-276765949af547aba1ca5c576f2859ea.r2.dev', 'pub-9cf31543472247c2936bb3ad6524d445.r2.dev', 'www.facebook.com', 'pro-s3-dre01.s3.amazonaws.com', 's3-dev-dre01.s3.us-east-1.amazonaws.com', 's3-pro-dre001.s3.us-east-1.amazonaws.com', 's3-pro-dre002.s3.us-east-1.amazonaws.com', 'example.com', 'images.unsplash.com'],
    // 同时保留 remotePatterns 配置（更详细的控制）
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
        protocol: 'http',
        hostname: '54.196.149.18',
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
        hostname: 'dreamazebook.com',
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
        hostname: 'example.com',
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
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig;