/**
 * Cache Utilities
 * Helper functions for managing service worker cache
 */

import { logger } from './logger';

/**
 * Clear all images from the service worker cache
 */
export async function clearImageCache(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const activeWorker = registration.active;
    if (!activeWorker) {
      logger.warn('No active service worker');
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      activeWorker.postMessage(
        { type: 'CLEAR_IMAGE_CACHE' },
        [messageChannel.port2]
      );

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to clear image cache');
    return false;
  }
}

/**
 * Clear a specific URL from the cache
 */
export async function clearCacheForUrl(url: string): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    logger.warn('Service Worker not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const activeWorker = registration.active;
    if (!activeWorker) {
      logger.warn('No active service worker');
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      activeWorker.postMessage(
        { type: 'CLEAR_CACHE_URL', url },
        [messageChannel.port2]
      );

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to clear cache for URL');
    return false;
  }
}

/**
 * Force update the service worker
 */
export async function updateServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    logger.warn('Service Worker not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      logger.warn('No service worker registration found');
      return false;
    }

    await registration.update();
    logger.info('Service worker update triggered');
    return true;
  } catch (error) {
    logger.error({ error }, 'Failed to update service worker');
    return false;
  }
}

/**
 * Check if service worker is active
 */
export function isServiceWorkerActive(): boolean {
  return 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  imageCacheSize: number;
  apiCacheSize: number;
  totalSize: number;
} | null> {
  if (!('caches' in window)) {
    return null;
  }

  try {
    const [imageCache, apiCache] = await Promise.all([
      caches.open('dharma-images-cache'),
      caches.open('dharma-api-cache'),
    ]);

    const [imageKeys, apiKeys] = await Promise.all([
      imageCache.keys(),
      apiCache.keys(),
    ]);

    return {
      imageCacheSize: imageKeys.length,
      apiCacheSize: apiKeys.length,
      totalSize: imageKeys.length + apiKeys.length,
    };
  } catch (error) {
    logger.error({ error }, 'Failed to get cache stats');
    return null;
  }
}
