/**
 * Service Worker
 * Handles caching, offline functionality, and background sync
 */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { logger } from './lib/logger';

declare const self: ServiceWorkerGlobalScope & {
  skipWaiting(): void;
  clients: {
    claim(): Promise<void>;
  };
};

interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}

// Precache and route static assets with error handling
try {
  // Get the manifest and filter out problematic entries
  const originalManifest = self.__WB_MANIFEST || [];
  const filteredManifest = originalManifest.filter((entry) => {
    const url = typeof entry === 'string' ? entry : entry.url;
    return !url.includes('middleware-build-manifest.js') &&
      !url.includes('app-build-manifest.json') &&
      !url.includes('build-manifest.json') &&
      !url.includes('react-loadable-manifest.json') &&
      !url.includes('_next/server/') &&
      !url.includes('_buildManifest.js') &&
      !url.includes('_ssgManifest.js');
  });

  logger.info(`Precaching ${filteredManifest.length} assets`);
  precacheAndRoute(filteredManifest);
} catch (error) {
  logger.warn({ error }, 'Precaching failed');
}

// Clean up outdated caches
cleanupOutdatedCaches();

/**
 * Cache Strategies
 */

// Cache API responses with NetworkFirst strategy (excluding auth routes)
registerRoute(
  ({ request }) => {
    // Exclude authentication-related routes from caching
    if (request.url.includes('/auth/') ||
      request.url.includes('supabase.co/auth/') ||
      request.url.includes('accounts.google.com') ||
      request.url.includes('oauth') ||
      request.url.includes('login') ||
      request.url.includes('callback')) {
      return false;
    }

    return request.destination === 'document' ||
      request.url.includes('/api/');
  },
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

// Cache images with StaleWhileRevalidate strategy
// This ensures images are updated while still providing fast cached responses
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'dharma-images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days (reduced from 30 days)
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

/**
 * Error handling for service worker
 */
addEventListener('error', (event) => {
  logger.error({ error: (event as ErrorEvent).error }, 'Service Worker error');
});

addEventListener('unhandledrejection', (event) => {
  logger.error({ reason: event.reason }, 'Service Worker unhandled rejection');

  // Handle specific precaching errors
  if (event.reason && event.reason.message && event.reason.message.includes('bad-precaching-response')) {
    logger.warn('Precaching error detected, continuing without problematic resources');
    event.preventDefault();
    return;
  }

  event.preventDefault();
});

/**
 * Install event handler
 */
addEventListener('install', (event) => {
  logger.info('Service Worker installing...');

  // Handle installation with error recovery
  (event as ExtendableEvent).waitUntil(
    Promise.resolve().then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting();
    }).catch((error) => {
      logger.warn({ error }, 'Service Worker installation error');
      // Continue anyway
      return self.skipWaiting();
    })
  );
});

/**
 * Activate event handler
 */
addEventListener('activate', (event) => {
  logger.info('Service Worker activating...');
  // Claim all clients immediately
  (event as ExtendableEvent).waitUntil(self.clients.claim());
});

/**
 * Message handling for cache operations
 */
addEventListener('message', async (_event) => {
  if (_event.data && _event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Handle cache clearing requests
  if (_event.data && _event.data.type === 'CLEAR_IMAGE_CACHE') {
    try {
      const cache = await caches.open('dharma-images-cache');
      const keys = await cache.keys();
      await Promise.all(keys.map(key => cache.delete(key)));
      logger.info('Image cache cleared successfully');

      // Notify the client
      if (_event.ports && _event.ports[0]) {
        _event.ports[0].postMessage({ success: true });
      }
    } catch (error) {
      logger.error({ error }, 'Failed to clear image cache');
      if (_event.ports && _event.ports[0]) {
        _event.ports[0].postMessage({ success: false, error });
      }
    }
  }

  // Handle specific URL cache clearing
  if (_event.data && _event.data.type === 'CLEAR_CACHE_URL') {
    try {
      const url = _event.data.url;
      const cache = await caches.open('dharma-images-cache');
      await cache.delete(url);
      logger.info(`Cleared cache for: ${url}`);

      if (_event.ports && _event.ports[0]) {
        _event.ports[0].postMessage({ success: true });
      }
    } catch (error) {
      logger.error({ error }, 'Failed to clear cache for URL');
      if (_event.ports && _event.ports[0]) {
        _event.ports[0].postMessage({ success: false, error });
      }
    }
  }
});

export { };