/**
 * Cache Strategy Manager Implementation
 * Implements different caching strategies and TTL management
 */

import {
  CacheStrategy,
  CacheEntry,
  StorageOptions,
  CachePriority
} from '@/types/cache';
import { StorageManager } from './storage-manager';
import { getCurrentConfig, contentCacheConfig } from './config';
import { logger } from '../logger';

/**
 * TTL (Time-to-Live) Manager
 */
export class TTLManager {
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get TTL for content type
   */
  static getTTLForContentType(contentType: string): number {
    const config = contentCacheConfig;

    switch (contentType) {
      case 'spiritual-content':
        return config.spiritualContent.ttl;
      case 'api-response':
        return config.apiResponses.ttl;
      case 'search-result':
        return config.searchResults.ttl;
      case 'user-data':
        return config.userData.ttl;
      case 'static-asset':
        return config.staticAssets.ttl;
      case 'image':
        return config.images.ttl;
      case 'font':
        return config.fonts.ttl;
      default:
        return this.DEFAULT_TTL;
    }
  }

  /**
   * Check if entry is expired
   */
  static isExpired(entry: CacheEntry): boolean {
    const now = Date.now();
    return (entry.timestamp + entry.ttl) < now;
  }

  /**
   * Check if entry is stale (approaching expiration)
   */
  static isStale(entry: CacheEntry, staleThreshold: number = 0.8): boolean {
    const now = Date.now();
    const age = now - entry.timestamp;
    const staleTime = entry.ttl * staleThreshold;
    return age > staleTime;
  }

  /**
   * Calculate remaining TTL
   */
  static getRemainingTTL(entry: CacheEntry): number {
    const now = Date.now();
    const remaining = (entry.timestamp + entry.ttl) - now;
    return Math.max(0, remaining);
  }

  /**
   * Extend TTL for an entry
   */
  static extendTTL(entry: CacheEntry, extensionMs: number): CacheEntry {
    return {
      ...entry,
      ttl: entry.ttl + extensionMs
    };
  }

  /**
   * Refresh TTL (reset to original value)
   */
  static refreshTTL(entry: CacheEntry, contentType: string): CacheEntry {
    return {
      ...entry,
      timestamp: Date.now(),
      ttl: this.getTTLForContentType(contentType)
    };
  }
}

/**
 * Cache Priority Manager
 */
export class CachePriorityManager {
  private static readonly PRIORITY_WEIGHTS: Record<CachePriority, number> = {
    high: 3,
    medium: 2,
    low: 1
  };

  /**
   * Get priority for content type
   */
  static getPriorityForContentType(contentType: string): CachePriority {
    const config = contentCacheConfig;

    switch (contentType) {
      case 'spiritual-content':
        return config.spiritualContent.priority;
      case 'api-response':
        return config.apiResponses.priority;
      case 'search-result':
        return config.searchResults.priority;
      case 'user-data':
        return config.userData.priority;
      case 'static-asset':
        return config.staticAssets.priority;
      case 'image':
        return config.images.priority;
      case 'font':
        return config.fonts.priority;
      default:
        return 'medium';
    }
  }

  /**
   * Compare priorities (higher number = higher priority)
   */
  static comparePriorities(a: CachePriority, b: CachePriority): number {
    return this.PRIORITY_WEIGHTS[b] - this.PRIORITY_WEIGHTS[a];
  }

  /**
   * Check if priority A is higher than priority B
   */
  static isHigherPriority(a: CachePriority, b: CachePriority): boolean {
    return this.PRIORITY_WEIGHTS[a] > this.PRIORITY_WEIGHTS[b];
  }

  /**
   * Get weight for priority level
   */
  static getPriorityWeight(priority: CachePriority): number {
    return this.PRIORITY_WEIGHTS[priority];
  }
}

/**
 * Abstract base class for cache strategies
 */
abstract class BaseCacheStrategy {
  protected storageManager: StorageManager;
  protected config = getCurrentConfig();

  constructor(storageManager: StorageManager) {
    this.storageManager = storageManager;
  }

  /**
   * Execute the caching strategy
   */
  abstract execute(
    key: string,
    fetchFunction: () => Promise<unknown>,
    options?: StorageOptions
  ): Promise<unknown>;

  /**
   * Validate cached entry
   */
  protected async validateCachedEntry(key: string): Promise<CacheEntry | null> {
    try {
      const entry = await this.storageManager.get(key) as CacheEntry;

      if (!entry) {
        return null;
      }

      // Check if expired
      if (TTLManager.isExpired(entry)) {
        await this.storageManager.remove(key);
        return null;
      }

      return entry;
    } catch (error) {
      logger.error({ error }, 'Failed to validate cached entry');
      return null;
    }
  }

  /**
   * Store data with appropriate options
   */
  protected async storeData(
    key: string,
    data: unknown,
    options: StorageOptions = {}
  ): Promise<void> {
    try {
      await this.storageManager.set(key, data, options);
    } catch (error) {
      logger.error({ error }, 'Failed to store data');
      throw error;
    }
  }
}

/**
 * Cache-First Strategy
 * Returns cached data if available, otherwise fetches and caches
 */
class CacheFirstStrategy extends BaseCacheStrategy {
  async execute(
    key: string,
    fetchFunction: () => Promise<unknown>,
    options: StorageOptions = {}
  ): Promise<unknown> {
    // Try to get from cache first
    const cachedEntry = await this.validateCachedEntry(key);

    if (cachedEntry) {
      return cachedEntry.data;
    }

    // Cache miss - fetch from network
    try {
      const data = await fetchFunction();

      // Store in cache for future requests
      await this.storeData(key, data, options);

      return data;
    } catch (error) {
      logger.error({ error }, 'Network fetch failed in cache-first strategy');
      throw error;
    }
  }
}

/**
 * Network-First Strategy
 * Tries network first, falls back to cache on failure
 */
class NetworkFirstStrategy extends BaseCacheStrategy {
  async execute(
    key: string,
    fetchFunction: () => Promise<unknown>,
    options: StorageOptions = {}
  ): Promise<unknown> {
    try {
      // Try network first
      const data = await fetchFunction();

      // Update cache with fresh data
      await this.storeData(key, data, options);

      return data;
    } catch (error) {
      logger.warn({ error }, 'Network fetch failed, trying cache');

      // Network failed - try cache
      const cachedEntry = await this.validateCachedEntry(key);

      if (cachedEntry) {
        return cachedEntry.data;
      }

      // Both network and cache failed
      throw error;
    }
  }
}

/**
 * Stale-While-Revalidate Strategy
 * Returns cached data immediately, updates cache in background
 */
class StaleWhileRevalidateStrategy extends BaseCacheStrategy {
  async execute(
    key: string,
    fetchFunction: () => Promise<unknown>,
    options: StorageOptions = {}
  ): Promise<unknown> {
    const cachedEntry = await this.validateCachedEntry(key);

    if (cachedEntry) {
      // Return cached data immediately
      const cachedData = cachedEntry.data;

      // Check if data is stale and needs revalidation
      if (TTLManager.isStale(cachedEntry)) {
        // Revalidate in background (don't await)
        this.revalidateInBackground(key, fetchFunction, options);
      }

      return cachedData;
    }

    // No cached data - fetch from network
    try {
      const data = await fetchFunction();
      await this.storeData(key, data, options);
      return data;
    } catch (error) {
      logger.error({ error }, 'Network fetch failed in stale-while-revalidate');
      throw error;
    }
  }

  /**
   * Revalidate data in background
   */
  private async revalidateInBackground(
    key: string,
    fetchFunction: () => Promise<unknown>,
    options: StorageOptions
  ): Promise<void> {
    try {
      const freshData = await fetchFunction();
      await this.storeData(key, freshData, options);
    } catch (error) {
      logger.warn({ error }, 'Background revalidation failed');
    }
  }
}

/**
 * Network-Only Strategy
 * Always fetches from network, never uses cache
 */
class NetworkOnlyStrategy extends BaseCacheStrategy {
  async execute(
    _key: string,
    fetchFunction: () => Promise<unknown>,
    _options?: StorageOptions
  ): Promise<unknown> {
    return await fetchFunction();
  }
}

/**
 * Cache-Only Strategy
 * Only returns cached data, never fetches from network
 */
class CacheOnlyStrategy extends BaseCacheStrategy {
  async execute(
    key: string,
    _fetchFunction: () => Promise<unknown>,
    _options?: StorageOptions
  ): Promise<unknown> {
    const cachedEntry = await this.validateCachedEntry(key);

    if (cachedEntry) {
      return cachedEntry.data;
    }

    throw new Error(`No cached data available for key: ${key}`);
  }
}/**

 * Strategy Factory
 * Creates appropriate strategy instances
 */
export class CacheStrategyFactory {
  private static strategies = new Map<CacheStrategy, new (storageManager: StorageManager) => BaseCacheStrategy>();

  static {
    // Register available strategies
    this.strategies.set('cache-first', CacheFirstStrategy);
    this.strategies.set('network-first', NetworkFirstStrategy);
    this.strategies.set('stale-while-revalidate', StaleWhileRevalidateStrategy);
    this.strategies.set('network-only', NetworkOnlyStrategy);
    this.strategies.set('cache-only', CacheOnlyStrategy);
  }

  /**
   * Create strategy instance
   */
  static createStrategy(
    strategy: CacheStrategy,
    storageManager: StorageManager
  ): BaseCacheStrategy {
    const StrategyClass = this.strategies.get(strategy);

    if (!StrategyClass) {
      throw new Error(`Unknown cache strategy: ${strategy}`);
    }

    return new StrategyClass(storageManager);
  }

  /**
   * Get available strategies
   */
  static getAvailableStrategies(): CacheStrategy[] {
    return Array.from(this.strategies.keys());
  }
}

/**
 * Cache Configuration Manager
 */
export class CacheConfigurationManager {
  private config = getCurrentConfig();
  private customConfigs = new Map<string, Partial<StorageOptions>>();

  /**
   * Set custom configuration for a content type
   */
  setContentTypeConfig(contentType: string, config: Partial<StorageOptions>): void {
    this.customConfigs.set(contentType, config);
  }

  /**
   * Get configuration for content type
   */
  getContentTypeConfig(contentType: string): StorageOptions {
    const customConfig = this.customConfigs.get(contentType) || {};

    return {
      ttl: TTLManager.getTTLForContentType(contentType),
      priority: CachePriorityManager.getPriorityForContentType(contentType),
      compress: this.shouldCompress(contentType),
      strategy: this.getStrategyForContentType(contentType),
      ...customConfig
    };
  }

  /**
   * Get strategy for content type
   */
  private getStrategyForContentType(contentType: string): CacheStrategy {
    const config = contentCacheConfig;

    switch (contentType) {
      case 'spiritual-content':
        return config.spiritualContent.strategy;
      case 'api-response':
        return config.apiResponses.strategy;
      case 'search-result':
        return config.searchResults.strategy;
      case 'user-data':
        return config.userData.strategy;
      case 'static-asset':
        return config.staticAssets.strategy;
      case 'image':
        return config.images.strategy;
      case 'font':
        return config.fonts.strategy;
      default:
        return this.config.strategies.api;
    }
  }

  /**
   * Check if content type should be compressed
   */
  private shouldCompress(contentType: string): boolean {
    const config = contentCacheConfig;

    switch (contentType) {
      case 'spiritual-content':
        return config.spiritualContent.compression;
      case 'api-response':
        return config.apiResponses.compression;
      case 'search-result':
        return config.searchResults.compression;
      case 'user-data':
        return config.userData.compression;
      case 'static-asset':
        return config.staticAssets.compression;
      case 'image':
        return config.images.compression;
      case 'font':
        return config.fonts.compression;
      default:
        return this.config.compression.enabled;
    }
  }

  /**
   * Update global cache configuration
   */
  updateGlobalConfig(updates: Partial<typeof this.config>): void {
    Object.assign(this.config, updates);
  }

  /**
   * Reset to default configuration
   */
  resetToDefaults(): void {
    this.config = getCurrentConfig();
    this.customConfigs.clear();
  }

  /**
   * Get current global configuration
   */
  getGlobalConfig(): typeof this.config {
    return { ...this.config };
  }
}

/**
 * Main Strategy Manager
 * Orchestrates cache strategies and configuration
 */
export class CacheStrategyManager {
  private storageManager: StorageManager;
  private configManager: CacheConfigurationManager;
  private strategyInstances = new Map<CacheStrategy, BaseCacheStrategy>();

  constructor(storageManager: StorageManager) {
    this.storageManager = storageManager;
    this.configManager = new CacheConfigurationManager();
  }

  /**
   * Execute caching strategy for content
   */
  async executeStrategy(
    key: string,
    contentType: string,
    fetchFunction: () => Promise<unknown>
  ): Promise<unknown> {
    const config = this.configManager.getContentTypeConfig(contentType);
    const strategy = this.getStrategyInstance(config.strategy!);

    return await strategy.execute(key, fetchFunction, config);
  }

  /**
   * Get or create strategy instance
   */
  private getStrategyInstance(strategyType: CacheStrategy): BaseCacheStrategy {
    if (!this.strategyInstances.has(strategyType)) {
      const strategy = CacheStrategyFactory.createStrategy(strategyType, this.storageManager);
      this.strategyInstances.set(strategyType, strategy);
    }

    return this.strategyInstances.get(strategyType)!;
  }

  /**
   * Configure content type
   */
  configureContentType(contentType: string, config: Partial<StorageOptions>): void {
    this.configManager.setContentTypeConfig(contentType, config);
  }

  /**
   * Get configuration manager
   */
  getConfigurationManager(): CacheConfigurationManager {
    return this.configManager;
  }

  /**
   * Clear strategy instances (force recreation)
   */
  clearStrategyInstances(): void {
    this.strategyInstances.clear();
  }
}

// Export strategy classes for external use
export {
  BaseCacheStrategy,
  CacheFirstStrategy,
  NetworkFirstStrategy,
  StaleWhileRevalidateStrategy,
  NetworkOnlyStrategy,
  CacheOnlyStrategy
};