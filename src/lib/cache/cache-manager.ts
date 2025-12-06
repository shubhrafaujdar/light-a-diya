/**
 * Cache Manager Implementation
 * High-level cache management with content-type specific handling
 */

import { CacheManager as ICacheManager, StorageManager as IStorageManager } from './interfaces';
import { 
  CacheStats, 
  CacheType, 
  CacheEntry, 
  SpiritualContentCache,
  ApiResponseCache,
  AssetCache
} from '@/types/cache';
import { logger } from '../logger';
import {
  getCurrentConfig,
  contentCacheConfig,
  performanceConfig
} from './config';

/**
 * Cache key namespace management
 */
class CacheKeyManager {
  private static readonly NAMESPACE_SEPARATOR = ':';
  private static readonly NAMESPACES = {
    CONTENT: 'content',
    API: 'api',
    ASSET: 'asset',
    META: 'meta'
  } as const;

  /**
   * Generate cache key with namespace
   */
  static generateKey(namespace: string, identifier: string, subKey?: string): string {
    const parts = [namespace, identifier];
    if (subKey) {
      parts.push(subKey);
    }
    return parts.join(this.NAMESPACE_SEPARATOR);
  }

  /**
   * Parse cache key to extract components
   */
  static parseKey(key: string): { namespace: string; identifier: string; subKey?: string } {
    const parts = key.split(this.NAMESPACE_SEPARATOR);
    return {
      namespace: parts[0],
      identifier: parts[1],
      subKey: parts[2]
    };
  }

  /**
   * Generate content cache key
   */
  static contentKey(contentId: string, type: 'aarti' | 'deity' = 'aarti'): string {
    return this.generateKey(this.NAMESPACES.CONTENT, type, contentId);
  }

  /**
   * Generate API cache key
   */
  static apiKey(url: string, params?: Record<string, unknown>): string {
    const identifier = this.normalizeUrl(url);
    const subKey = params ? this.hashParams(params) : undefined;
    return this.generateKey(this.NAMESPACES.API, identifier, subKey);
  }

  /**
   * Generate asset cache key
   */
  static assetKey(url: string, type: 'image' | 'font' | 'stylesheet' = 'image'): string {
    const identifier = this.normalizeUrl(url);
    return this.generateKey(this.NAMESPACES.ASSET, type, identifier);
  }

  /**
   * Normalize URL for consistent key generation
   */
  private static normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${ urlObj.pathname }${ urlObj.search } `.replace(/[^a-zA-Z0-9]/g, '_');
    } catch {
      return url.replace(/[^a-zA-Z0-9]/g, '_');
    }
  }

  /**
   * Hash parameters for consistent key generation
   */
  private static hashParams(params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, unknown>);

    return btoa(JSON.stringify(sortedParams)).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Get all keys for a namespace
   */
  static getNamespacePattern(namespace: string): string {
    return `${ namespace }${ this.NAMESPACE_SEPARATOR } `;
  }
}

/**
 * Cache entry validation utilities
 */
class CacheValidator {
  /**
   * Validate cache entry structure
   */
  static validateEntry<T>(entry: unknown): entry is CacheEntry<T> {
    if (!entry || typeof entry !== 'object') {
      return false;
    }

    const cacheEntry = entry as CacheEntry<T>;

    return (
      typeof cacheEntry.key === 'string' &&
      cacheEntry.data !== undefined &&
      typeof cacheEntry.timestamp === 'number' &&
      typeof cacheEntry.ttl === 'number' &&
      typeof cacheEntry.version === 'string' &&
      typeof cacheEntry.priority === 'string' &&
      typeof cacheEntry.size === 'number'
    );
  }

  /**
   * Check if cache entry is expired
   */
  static isExpired(entry: CacheEntry): boolean {
    const now = Date.now();
    return (entry.timestamp + entry.ttl) < now;
  }

  /**
   * Check if cache entry is valid (not expired and properly structured)
   */
  static isValid<T>(entry: unknown): entry is CacheEntry<T> {
    if (!this.validateEntry<T>(entry)) {
      return false;
    }

    return !this.isExpired(entry as CacheEntry<T>);
  }

  /**
   * Validate spiritual content cache entry
   */
  static validateSpiritualContent(entry: unknown): entry is SpiritualContentCache {
    if (!this.validateEntry(entry)) {
      return false;
    }

    const contentEntry = entry as SpiritualContentCache;
    const data = contentEntry.data;

    return (
      data &&
      typeof data === 'object' &&
      'deity' in data &&
      'aarti' in data &&
      'translations' in data &&
      'images' in data &&
      Array.isArray(data.images)
    );
  }

  /**
   * Validate API response cache entry
   */
  static validateApiResponse(entry: unknown): entry is ApiResponseCache {
    if (!this.validateEntry(entry)) {
      return false;
    }

    const apiEntry = entry as ApiResponseCache;
    const data = apiEntry.data;

    return (
      data &&
      typeof data === 'object' &&
      'response' in data &&
      'headers' in data &&
      'status' in data &&
      typeof data.status === 'number'
    );
  }

  /**
   * Validate asset cache entry
   */
  static validateAsset(entry: unknown): entry is AssetCache {
    if (!this.validateEntry(entry)) {
      return false;
    }

    const assetEntry = entry as AssetCache;
    const data = assetEntry.data;

    return (
      data &&
      typeof data === 'object' &&
      'blob' in data &&
      'mimeType' in data &&
      'url' in data &&
      data.blob instanceof Blob
    );
  }
}

/**
 * Performance tracking for cache operations
 */
class CachePerformanceTracker {
  private static hits = new Map<string, number>();
  private static misses = new Map<string, number>();
  private static responseTimes = new Map<string, number[]>();

  /**
   * Record cache hit
   */
  static recordHit(key: string, responseTime: number): void {
    if (!performanceConfig.enabled) return;

    // Record hit count
    const currentHits = this.hits.get(key) || 0;
    this.hits.set(key, currentHits + 1);

    // Record response time
    const times = this.responseTimes.get(key) || [];
    times.push(responseTime);

    // Keep only last 100 measurements per key
    if (times.length > 100) {
      times.shift();
    }

    this.responseTimes.set(key, times);
  }

  /**
   * Record cache miss
   */
  static recordMiss(key: string): void {
    if (!performanceConfig.enabled) return;

    const currentMisses = this.misses.get(key) || 0;
    this.misses.set(key, currentMisses + 1);
  }

  /**
   * Get performance metrics for a key
   */
  static getKeyMetrics(key: string): {
    hits: number;
    misses: number;
    hitRate: number;
    avgResponseTime: number;
  } {
    const hits = this.hits.get(key) || 0;
    const misses = this.misses.get(key) || 0;
    const total = hits + misses;
    const hitRate = total > 0 ? hits / total : 0;

    const times = this.responseTimes.get(key) || [];
    const avgResponseTime = times.length > 0
      ? times.reduce((sum, time) => sum + time, 0) / times.length
      : 0;

    return { hits, misses, hitRate, avgResponseTime };
  }

  /**
   * Get overall performance metrics
   */
  static getOverallMetrics(): {
    totalHits: number;
    totalMisses: number;
    overallHitRate: number;
    avgResponseTime: number;
  } {
    let totalHits = 0;
    let totalMisses = 0;
    let totalResponseTime = 0;
    let totalMeasurements = 0;

    for (const hits of this.hits.values()) {
      totalHits += hits;
    }

    for (const misses of this.misses.values()) {
      totalMisses += misses;
    }

    for (const times of this.responseTimes.values()) {
      totalResponseTime += times.reduce((sum, time) => sum + time, 0);
      totalMeasurements += times.length;
    }

    const total = totalHits + totalMisses;
    const overallHitRate = total > 0 ? totalHits / total : 0;
    const avgResponseTime = totalMeasurements > 0 ? totalResponseTime / totalMeasurements : 0;

    return { totalHits, totalMisses, overallHitRate, avgResponseTime };
  }

  /**
   * Reset all metrics
   */
  static reset(): void {
    this.hits.clear();
    this.misses.clear();
    this.responseTimes.clear();
  }
}

/**
 * Main Cache Manager Implementation
 */
export class CacheManager implements ICacheManager {
  private config = getCurrentConfig();
  private storageManager: IStorageManager | undefined; // Will be injected
  private performanceTracker = CachePerformanceTracker;

  constructor(storageManager?: IStorageManager) {
    this.storageManager = storageManager;
  }

  /**
   * Set storage manager (dependency injection)
   */
  setStorageManager(storageManager: IStorageManager): void {
    this.storageManager = storageManager;
  }

  /**
   * Cache spiritual content (aartis, deities)
   */
  async cacheContent(key: string, content: unknown): Promise<void> {
    const startTime = performance.now();

    try {
      const cacheKey = CacheKeyManager.contentKey(key);
      const config = contentCacheConfig.spiritualContent;

      const entry: CacheEntry = {
        key: cacheKey,
        data: content,
        timestamp: Date.now(),
        ttl: config.ttl,
        version: '1.0.0',
        priority: config.priority,
        size: this.calculateSize(content)
      };

      if (this.storageManager) {
        await this.storageManager.set(cacheKey, entry, {
          ttl: config.ttl,
          priority: config.priority,
          compress: config.compression
        });
      }

      const responseTime = performance.now() - startTime;
      this.performanceTracker.recordHit(cacheKey, responseTime);

    } catch (error) {
      logger.error({ error }, 'Failed to cache content');
      throw error;
    }
  }

  /**
   * Get cached spiritual content
   */
  async getContent(key: string): Promise<unknown | null> {
    const startTime = performance.now();

    try {
      const cacheKey = CacheKeyManager.contentKey(key);

      if (!this.storageManager) {
        this.performanceTracker.recordMiss(cacheKey);
        return null;
      }

      const entry = await this.storageManager.get(cacheKey);

      if (!entry || !CacheValidator.isValid(entry)) {
        this.performanceTracker.recordMiss(cacheKey);
        return null;
      }

      const responseTime = performance.now() - startTime;
      this.performanceTracker.recordHit(cacheKey, responseTime);

      return entry.data;

    } catch (error) {
      logger.error({ error }, 'Failed to get cached content');
      const cacheKey = CacheKeyManager.contentKey(key);
      this.performanceTracker.recordMiss(cacheKey);
      return null;
    }
  }

  /**
   * Cache API response
   */
  async cacheApiResponse(url: string, response: unknown, ttl?: number): Promise<void> {
    const startTime = performance.now();

    try {
      const cacheKey = CacheKeyManager.apiKey(url);
      const config = contentCacheConfig.apiResponses;
      const cacheTtl = ttl || config.ttl;

      const entry: ApiResponseCache = {
        key: cacheKey,
        data: {
          response,
          headers: {},
          status: 200
        },
        timestamp: Date.now(),
        ttl: cacheTtl,
        version: '1.0.0',
        priority: config.priority,
        size: this.calculateSize(response)
      };

      if (this.storageManager) {
        await this.storageManager.set(cacheKey, entry, {
          ttl: cacheTtl,
          priority: config.priority,
          compress: config.compression
        });
      }

      const responseTime = performance.now() - startTime;
      this.performanceTracker.recordHit(cacheKey, responseTime);

    } catch (error) {
      logger.error({ error }, 'Failed to cache API response');
      throw error;
    }
  }

  /**
   * Get cached API response
   */
  async getApiResponse(url: string): Promise<unknown | null> {
    const startTime = performance.now();

    try {
      const cacheKey = CacheKeyManager.apiKey(url);

      if (!this.storageManager) {
        this.performanceTracker.recordMiss(cacheKey);
        return null;
      }

      const entry = await this.storageManager.get(cacheKey);

      if (!entry || !CacheValidator.validateApiResponse(entry)) {
        this.performanceTracker.recordMiss(cacheKey);
        return null;
      }

      const responseTime = performance.now() - startTime;
      this.performanceTracker.recordHit(cacheKey, responseTime);

      return entry.data.response;

    } catch (error) {
      logger.error({ error }, 'Failed to get cached API response');
      const cacheKey = CacheKeyManager.apiKey(url);
      this.performanceTracker.recordMiss(cacheKey);
      return null;
    }
  }

  /**
   * Cache asset (images, fonts, stylesheets)
   */
  async cacheAsset(url: string, blob: Blob): Promise<void> {
    const startTime = performance.now();

    try {
      const cacheKey = CacheKeyManager.assetKey(url);
      const config = contentCacheConfig.staticAssets;

      const entry: AssetCache = {
        key: cacheKey,
        data: {
          blob,
          mimeType: blob.type,
          url
        },
        timestamp: Date.now(),
        ttl: config.ttl,
        version: '1.0.0',
        priority: config.priority,
        size: blob.size
      };

      if (this.storageManager) {
        await this.storageManager.set(cacheKey, entry, {
          ttl: config.ttl,
          priority: config.priority,
          compress: false // Assets are already optimized
        });
      }

      const responseTime = performance.now() - startTime;
      this.performanceTracker.recordHit(cacheKey, responseTime);

    } catch (error) {
      logger.error({ error }, 'Failed to cache asset');
      throw error;
    }
  }

  /**
   * Get cached asset
   */
  async getAsset(url: string): Promise<Blob | null> {
    const startTime = performance.now();

    try {
      const cacheKey = CacheKeyManager.assetKey(url);

      if (!this.storageManager) {
        this.performanceTracker.recordMiss(cacheKey);
        return null;
      }

      const entry = await this.storageManager.get(cacheKey);

      if (!entry || !CacheValidator.validateAsset(entry)) {
        this.performanceTracker.recordMiss(cacheKey);
        return null;
      }

      const responseTime = performance.now() - startTime;
      this.performanceTracker.recordHit(cacheKey, responseTime);

      return entry.data.blob;

    } catch (error) {
      logger.error({ error }, 'Failed to get cached asset');
      const cacheKey = CacheKeyManager.assetKey(url);
      this.performanceTracker.recordMiss(cacheKey);
      return null;
    }
  }

  /**
   * Clear cache by type or all
   */
  async clearCache(type?: CacheType): Promise<void> {
    try {
      if (!this.storageManager) {
        return;
      }

      if (!type || type === 'all') {
        await this.storageManager.clear();
        this.performanceTracker.reset();
        return;
      }

      // Clear specific cache type
      const namespaceMap: Record<CacheType, string> = {
        content: 'content',
        api: 'api',
        assets: 'asset',
        all: '' // handled above
      };

      const namespace = namespaceMap[type];
      if (namespace) {
        // This would need to be implemented in StorageManager
        // For now, we'll clear all and let the storage manager handle it
        logger.warn({ type }, 'Selective cache clearing not yet implemented');
      }

    } catch (error) {
      logger.error({ error }, 'Failed to clear cache');
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<CacheStats> {
    try {
      const performanceMetrics = this.performanceTracker.getOverallMetrics();

      // Default stats if storage manager is not available
      const defaultStats: CacheStats = {
        totalSize: 0,
        totalEntries: 0,
        hitRate: performanceMetrics.overallHitRate,
        missRate: 1 - performanceMetrics.overallHitRate,
        storageUsage: {
          indexeddb: 0,
          cacheApi: 0,
          localStorage: 0
        },
        lastCleanup: Date.now()
      };

      if (!this.storageManager) {
        return defaultStats;
      }

      // Get storage usage from storage manager
      const storageUsage = await this.storageManager.getStorageUsage();

      return {
        ...defaultStats,
        totalSize: storageUsage.used,
        totalEntries: 0, // Would need to be tracked by storage manager
        storageUsage: {
          indexeddb: storageUsage.used,
          cacheApi: 0, // Would need separate tracking
          localStorage: 0 // Would need separate tracking
        }
      };

    } catch (error) {
      logger.error({ error }, 'Failed to get cache stats');
      throw error;
    }
  }

  /**
   * Check if cache entry is valid
   */
  async isValid(key: string): Promise<boolean> {
    try {
      if (!this.storageManager) {
        return false;
      }

      const entry = await this.storageManager.get(key);
      return CacheValidator.isValid(entry);

    } catch (error) {
      logger.error({ error }, 'Failed to validate cache entry');
      return false;
    }
  }

  /**
   * Invalidate cache entry
   */
  async invalidate(key: string): Promise<void> {
    try {
      if (!this.storageManager) {
        return;
      }

      await this.storageManager.remove(key);

    } catch (error) {
      logger.error({ error }, 'Failed to invalidate cache entry');
      throw error;
    }
  }

  /**
   * Calculate size of data for storage tracking
   */
  private calculateSize(data: unknown): number {
    try {
      if (data instanceof Blob) {
        return data.size;
      }

      const jsonString = JSON.stringify(data);
      return new Blob([jsonString]).size;

    } catch (error) {
      logger.warn({ error }, 'Failed to calculate data size');
      return 0;
    }
  }
}

// Export utilities for external use
export { CacheKeyManager, CacheValidator, CachePerformanceTracker };