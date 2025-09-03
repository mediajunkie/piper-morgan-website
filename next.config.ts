import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for deployment to static hosting
  output: 'export',

  // No basePath - website deploys to root of GitHub Pages

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Configure trailing slashes for better URL consistency
  trailingSlash: true,

  // Skip build-time linting (handled separately)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip build-time type checking (handled separately)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Security headers for static export
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.convertkit.com https://medium.com *.google-analytics.com *.googletagmanager.com; frame-ancestors 'none';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Experimental features (disabled for static export compatibility)
  // experimental: {
  //   optimizeCss: true,
  // },
};

export default nextConfig;
