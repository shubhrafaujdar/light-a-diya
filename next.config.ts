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
            /_next\/static\/chunks\/webpack/,
            /_next\/server\//,
            /_next\/app-build-manifest\.json$/,
            /_next\/server\/middleware-build-manifest\.js$/,
            /build-manifest\.json$/,
            /react-loadable-manifest\.json$/,
            /_buildManifest\.js$/,
            /_ssgManifest\.js$/,
            /middleware-build-manifest\.js$/,
            /server\//,
            /\.js\.map$/,
            /\.css\.map$/
          ],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB,
          manifestTransforms: [
            (manifestEntries) => {
              // Filter out problematic entries
              const filteredEntries = manifestEntries.filter(entry => {
                const url = entry.url;
                return !url.includes('app-build-manifest.json') &&
                  !url.includes('build-manifest.json') &&
                  !url.includes('react-loadable-manifest.json') &&
                  !url.includes('middleware-build-manifest.js') &&
                  !url.includes('_next/server/') &&
                  !url.includes('_buildManifest.js') &&
                  !url.includes('_ssgManifest.js') &&
                  !url.includes('.map');
              });
              return { manifest: filteredEntries };
            }
          ]
        })
      );
    }

    return config;
  },

  // Enable React Compiler
  reactCompiler: true,

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
      // Quiz API routes - 1 hour cache with stale-while-revalidate
      {
        source: '/api/quiz/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Other API routes - 5 minutes cache
      {
        source: '/api/((?!quiz).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
