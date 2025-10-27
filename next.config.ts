import type { NextConfig } from "next";
import { InjectManifest } from 'workbox-webpack-plugin';

const nextConfig: NextConfig = {
  webpack: (config, { isServer, dev }) => {
    // Only add Workbox in production client builds
    if (!isServer && !dev) {
      config.plugins.push(
        new InjectManifest({
          swSrc: './src/sw.ts',
          swDest: '../public/sw.js',
          exclude: [
            /\.map$/,
            /manifest$/,
            /\.htaccess$/,
            /_next\/static\/chunks\/pages\//,
            /_next\/static\/chunks\/webpack/
          ],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        })
      );
    }

    return config;
  },
  
  // Enable experimental features for better caching
  experimental: {
    // Add any experimental features here if needed
  },
  
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300', // 5 minutes
          },
        ],
      },
    ];
  },
};

export default nextConfig;
