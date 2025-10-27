/**
 * Service Worker
 * Handles caching, offline functionality, and background sync
 */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

// Precache and route static assets
precacheAndRoute(self.__WB_MANIFEST);

// Clean up outdated caches
cleanupOutdatedCaches();

/**
 * Cache Strategies
 */

// Cache API responses with NetworkFirst strategy
registerRoute(
  ({ request }) => request.destination === 'document' || 
                   request.url.includes('/api/'),
  new NetworkFirst({
    cacheName: 'dharma-api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Cache images with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'dharma-images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Cache fonts with CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'dharma-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  })
);

// Cache CSS and JS with StaleWhileRevalidate
registerRoute(
  ({ request }) => request.destination === 'style' || 
                   request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'dharma-static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Background sync will be implemented later

// Message handling will be implemented later

// Event listeners will be implemented later

// Helper functions will be implemented later

export {};