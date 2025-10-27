/**
 * Cache Configuration
 * Central configuration for the caching system
 */

import { CacheConfig, CacheStrategy } from '@/types/cache';

/**
 * Default Cache Configuration
 */
const defaultCacheConfig: CacheConfig = {
  // Maximum cache size: 50MB
  maxSize: 50 * 1024 * 1024,
  
  // Default TTL: 5 minutes for API responses
  defaultTtl: 5 * 60 * 1000,
  
  // Caching strategies for different content types
  strategies: {
    content: 'stale-while-revalidate',
    api: 'network-first',
    assets: 'cache-first'
  },
  
  // Offline configuration
  offline: {
    maxItems: 10, // Cache 10 most recent aartis for offline access
    essentialContent: [
      'deities-list',
      'popular-aartis',
      'user-preferences'
    ]
  },
  
  // Compression settings
  compression: {
    enabled: true,
    threshold: 1024 // Compress items larger than 1KB
  }
};

/**
 * Content-specific cache configurations
 */
const contentCacheConfig = {
  // Spiritual content (aartis, deities)
  spiritualContent: {
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    strategy: 'stale-while-revalidate' as CacheStrategy,
    priority: 'high' as const,
    offline: true,
    compression: true
  },
  
  // API responses
  apiResponses: {
    ttl: 5 * 60 * 1000, // 5 minutes
    strategy: 'network-first' as CacheStrategy,
    priority: 'medium' as const,
    offline: false,
    compression: true
  },
  
  // Search results
  searchResults: {
    ttl: 10 * 60 * 1000, // 10 minutes
    strategy: 'stale-while-revalidate' as CacheStrategy,
    priority: 'medium' as const,
    offline: true,
    compression: true
  },
  
  // User data
  userData: {
    ttl: 60 * 60 * 1000, // 1 hour
    strategy: 'network-first' as CacheStrategy,
    priority: 'high' as const,
    offline: true,
    compression: false // User data is usually small
  },
  
  // Static assets
  staticAssets: {
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    strategy: 'cache-first' as CacheStrategy,
    priority: 'low' as const,
    offline: true,
    compression: false // Assets are already optimized
  },
  
  // Images
  images: {
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
    strategy: 'cache-first' as CacheStrategy,
    priority: 'medium' as const,
    offline: true,
    compression: false // Images are already compressed
  },
  
  // Fonts
  fonts: {
    ttl: 365 * 24 * 60 * 60 * 1000, // 1 year
    strategy: 'cache-first' as CacheStrategy,
    priority: 'high' as const,
    offline: true,
    compression: false
  }
};

/**
 * Storage quota management
 */
const storageQuotaConfig = {
  // Warning threshold (80% of max size)
  warningThreshold: 0.8,
  
  // Critical threshold (95% of max size)
  criticalThreshold: 0.95,
  
  // Cleanup strategy when quota is exceeded
  cleanupStrategy: {
    // Remove items in this order of priority
    priorityOrder: ['low', 'medium', 'high'] as const,
    
    // Remove expired items first
    removeExpiredFirst: true,
    
    // Remove least recently used items
    useLRU: true,
    
    // Percentage to free up when cleaning
    cleanupPercentage: 0.2 // Free up 20% of space
  }
};

/**
 * Performance monitoring configuration
 */
const performanceConfig = {
  // Enable performance monitoring
  enabled: true,
  
  // Sample rate for performance metrics (0.1 = 10% of requests)
  sampleRate: 0.1,
  
  // Metrics collection interval
  metricsInterval: 60 * 1000, // 1 minute
  
  // Performance thresholds
  thresholds: {
    cacheHitRate: 0.8, // 80% cache hit rate target
    averageResponseTime: 100, // 100ms average response time target
    maxResponseTime: 1000 // 1 second maximum response time
  }
};

/**
 * Sync configuration
 */
const syncConfig = {
  // Background sync interval
  syncInterval: 5 * 60 * 1000, // 5 minutes
  
  // Content freshness check interval
  freshnessCheckInterval: 60 * 60 * 1000, // 1 hour
  
  // Maximum offline actions to queue
  maxOfflineActions: 100,
  
  // Retry configuration for failed syncs
  retryConfig: {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 30 * 1000, // 30 seconds
    backoffMultiplier: 2
  }
};

/**
 * Debug configuration
 */
const debugConfig = {
  // Enable debug logging
  enabled: process.env.NODE_ENV === 'development',
  
  // Log levels
  logLevel: 'info' as 'debug' | 'info' | 'warn' | 'error',
  
  // Enable cache statistics logging
  logCacheStats: true,
  
  // Log cache operations
  logCacheOperations: false,
  
  // Enable performance logging
  logPerformance: true
};

/**
 * Feature flags for cache functionality
 */
const featureFlags = {
  // Enable service worker caching
  serviceWorkerCaching: true,
  
  // Enable IndexedDB caching
  indexedDBCaching: true,
  
  // Enable background sync
  backgroundSync: true,
  
  // Enable offline functionality
  offlineSupport: true,
  
  // Enable cache compression
  compression: true,
  
  // Enable performance monitoring
  performanceMonitoring: true,
  
  // Enable preloading
  preloading: true,
  
  // Enable cache warming
  cacheWarming: false // Disabled by default, can be enabled for production
};

/**
 * Environment-specific configurations
 */
const environmentConfig = {
  development: {
    ...defaultCacheConfig,
    // Shorter TTLs for development
    defaultTtl: 30 * 1000, // 30 seconds
    // Enable all debug features
    debug: {
      ...debugConfig,
      enabled: true,
      logCacheOperations: true
    }
  },
  
  production: {
    ...defaultCacheConfig,
    // Longer TTLs for production
    defaultTtl: 10 * 60 * 1000, // 10 minutes
    // Disable debug features
    debug: {
      ...debugConfig,
      enabled: false,
      logCacheOperations: false
    },
    // Enable cache warming in production
    features: {
      ...featureFlags,
      cacheWarming: true
    }
  },
  
  test: {
    ...defaultCacheConfig,
    // Very short TTLs for testing
    defaultTtl: 1000, // 1 second
    // Smaller cache size for testing
    maxSize: 1024 * 1024, // 1MB
    // Disable background processes for testing
    features: {
      ...featureFlags,
      backgroundSync: false,
      performanceMonitoring: false
    }
  }
};

/**
 * Get configuration for current environment
 */
const getCurrentConfig = (): CacheConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return environmentConfig.production;
    case 'test':
      return environmentConfig.test;
    default:
      return environmentConfig.development;
  }
};

/**
 * Cache key generators
 */
const cacheKeys = {
  // Spiritual content keys
  deity: (id: string) => `deity:${id}`,
  aarti: (id: string) => `aarti:${id}`,
  aartiContent: (id: string, language: string) => `aarti:${id}:${language}`,
  deityAartis: (deityId: string) => `deity:${deityId}:aartis`,
  
  // API response keys
  apiResponse: (endpoint: string, params?: Record<string, unknown>) => {
    const paramString = params ? `:${JSON.stringify(params)}` : '';
    return `api:${endpoint}${paramString}`;
  },
  
  // Search keys
  search: (query: string, filters?: unknown) => {
    const filterString = filters ? `:${JSON.stringify(filters)}` : '';
    return `search:${query}${filterString}`;
  },
  
  // User data keys
  userPreferences: (userId?: string) => `user:${userId || 'anonymous'}:preferences`,
  userFavorites: (userId?: string) => `user:${userId || 'anonymous'}:favorites`,
  
  // Asset keys
  image: (url: string) => `image:${url}`,
  font: (url: string) => `font:${url}`,
  stylesheet: (url: string) => `stylesheet:${url}`,
  
  // Version keys
  contentVersion: (contentId: string) => `version:${contentId}`,
  
  // Performance keys
  performanceMetrics: () => 'performance:metrics',
  cacheStats: () => 'cache:stats'
};

// Export all configurations
export {
  defaultCacheConfig,
  contentCacheConfig,
  storageQuotaConfig,
  performanceConfig,
  syncConfig,
  debugConfig,
  featureFlags,
  environmentConfig,
  getCurrentConfig,
  cacheKeys
};