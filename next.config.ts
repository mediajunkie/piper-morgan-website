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

  // Experimental features (disabled for static export compatibility)
  // experimental: {
  //   optimizeCss: true,
  // },
};

export default nextConfig;
