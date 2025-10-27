/**
 * Cache System Index
 * Main entry point for the caching infrastructure
 */

// Core interfaces
export * from './interfaces';

// Type definitions
export * from '@/types/cache';

// Configuration
export * from './config';

// TanStack Query setup
export * from './query-client';

// IndexedDB setup
export * from './indexeddb';

// Workbox configuration
export * from './workbox-config';

// Core implementations
export * from './cache-manager';
export * from './storage-manager';
export * from './strategy-manager';

// Re-export commonly used types and functions
export type {
  CacheManager as ICacheManager,
  StorageManager as IStorageManager,
  SyncManager,
  ContentManager,
  AssetManager,
  QueryManager,
  PerformanceMonitor
} from './interfaces';

export type {
  CacheEntry,
  CacheConfig,
  CacheStrategy,
  CacheType,
  CachePriority,
  StorageOptions,
  SpiritualContentCache,
  ApiResponseCache,
  AssetCache
} from '@/types/cache';

// Main configuration exports
export {
  defaultCacheConfig,
  contentCacheConfig,
  cacheKeys,
  getCurrentConfig
} from './config';

// Query client exports
export {
  createQueryClient,
  getQueryClient,
  queryKeys,
  cacheInvalidation,
  offlineQueries,
  queryUtils
} from './query-client';

// Database exports
export {
  getCacheDB,
  DharmaCacheDB
} from './indexeddb';

// Workbox exports
export {
  cacheConfigs as workboxCacheConfigs,
  runtimeCachingRules,
  backgroundSyncConfig
} from './workbox-config';

// Core implementation exports
export {
  CacheManager,
  CacheKeyManager,
  CacheValidator,
  CachePerformanceTracker
} from './cache-manager';

export {
  StorageManager,
  CompressionUtils,
  StorageQuotaManager,
  CacheGarbageCollector
} from './storage-manager';

export {
  CacheStrategyManager,
  CacheStrategyFactory,
  CacheConfigurationManager,
  TTLManager,
  CachePriorityManager
} from './strategy-manager';

/**
 * Cache System Status
 */
export interface CacheSystemStatus {
  initialized: boolean;
  serviceWorkerActive: boolean;
  indexedDBAvailable: boolean;
  queryClientReady: boolean;
  offlineSupported: boolean;
}

/**
 * Initialize the cache system
 */
export const initializeCacheSystem = async (): Promise<CacheSystemStatus> => {
  const status: CacheSystemStatus = {
    initialized: false,
    serviceWorkerActive: false,
    indexedDBAvailable: false,
    queryClientReady: false,
    offlineSupported: false
  };

  try {
    // Check IndexedDB availability
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      status.indexedDBAvailable = true;
      
      // Initialize the database
      const { getCacheDB } = await import('./indexeddb');
      const db = getCacheDB();
      await db.open();
    }

    // Check Service Worker support
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      status.serviceWorkerActive = true;
    }

    // Initialize Query Client
    if (typeof window !== 'undefined') {
      const { getQueryClient } = await import('./query-client');
      const queryClient = getQueryClient();
      status.queryClientReady = !!queryClient;
    }

    // Determine offline support
    status.offlineSupported = status.indexedDBAvailable && status.serviceWorkerActive;

    status.initialized = true;
  } catch (error) {
    console.error('Failed to initialize cache system:', error);
  }

  return status;
};

/**
 * Check if caching is supported in the current environment
 */
export const isCachingSupported = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Server-side
  }

  // Check for required APIs
  const hasIndexedDB = 'indexedDB' in window;
  const hasServiceWorker = 'serviceWorker' in navigator;
  const hasCacheAPI = 'caches' in window;

  return hasIndexedDB && hasServiceWorker && hasCacheAPI;
};

/**
 * Get cache system information
 */
export const getCacheSystemInfo = async () => {
  if (!isCachingSupported()) {
    return {
      supported: false,
      reason: 'Required APIs not available'
    };
  }

  try {
    const { getCacheDB } = await import('./indexeddb');
    const { getQueryClient, queryUtils } = await import('./query-client');
    const db = getCacheDB();
    const stats = await db.getStorageStats();
    const queryClient = getQueryClient();
    const queryStats = queryUtils.getCacheStats(queryClient);

    return {
      supported: true,
      indexedDB: {
        available: true,
        stats
      },
      queryClient: {
        available: true,
        stats: queryStats
      },
      serviceWorker: {
        available: 'serviceWorker' in navigator,
        registered: navigator.serviceWorker?.controller !== null
      }
    };
  } catch (error) {
    return {
      supported: false,
      reason: `Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Cache system utilities
 */
export const cacheUtils = {
  // Check if running in browser
  isBrowser: () => typeof window !== 'undefined',
  
  // Check if offline
  isOffline: () => typeof navigator !== 'undefined' && !navigator.onLine,
  
  // Generate cache key with timestamp
  generateTimestampedKey: (baseKey: string) => `${baseKey}:${Date.now()}`,
  
  // Parse timestamped key
  parseTimestampedKey: (key: string) => {
    const parts = key.split(':');
    const timestamp = parseInt(parts[parts.length - 1], 10);
    const baseKey = parts.slice(0, -1).join(':');
    return { baseKey, timestamp };
  },
  
  // Calculate cache entry size (rough estimation)
  estimateSize: (data: unknown): number => {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 0;
    }
  },
  
  // Check if data is cacheable
  isCacheable: (data: unknown): boolean => {
    if (data === null || data === undefined) return false;
    if (typeof data === 'function') return false;
    if (data instanceof Error) return false;
    return true;
  }
};

// Default export
const cacheSystem = {
  initializeCacheSystem,
  isCachingSupported,
  getCacheSystemInfo,
  cacheUtils
};

export default cacheSystem;