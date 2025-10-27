/**
 * Storage Manager Implementation
 * Manages browser storage operations with IndexedDB and Cache API integration
 */

import { StorageManager as IStorageManager } from './interfaces';
import { 
  StorageOptions, 
  StorageUsage, 
  CacheEntry,
  CachePriority,
  CacheError
} from '@/types/cache';
import { getCacheDB, DharmaCacheDB } from './indexeddb';
import { getCurrentConfig, storageQuotaConfig } from './config';

/**
 * Compression utilities for cached content
 */
class CompressionUtils {
  /**
   * Compress text data using gzip
   */
  static async compressText(text: string): Promise<Blob> {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    const encoder = new TextEncoder();
    const chunks: Uint8Array[] = [];
    
    // Start compression
    const writePromise = writer.write(encoder.encode(text));
    writer.close();
    
    // Read compressed chunks
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        chunks.push(value);
      }
    }
    
    await writePromise;
    return new Blob(chunks as BlobPart[]);
  }

  /**
   * Decompress gzipped data to text
   */
  static async decompressText(blob: Blob): Promise<string> {
    const stream = new DecompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    const decoder = new TextDecoder();
    const chunks: string[] = [];
    
    // Start decompression
    const writePromise = writer.write(await blob.arrayBuffer());
    writer.close();
    
    // Read decompressed chunks
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        chunks.push(decoder.decode(value, { stream: !done }));
      }
    }
    
    await writePromise;
    return chunks.join('');
  }

  /**
   * Check if data should be compressed based on size
   */
  static shouldCompress(data: unknown, threshold: number = 1024): boolean {
    try {
      const size = typeof data === 'string' 
        ? new Blob([data]).size 
        : new Blob([JSON.stringify(data)]).size;
      return size > threshold;
    } catch {
      return false;
    }
  }
}/**
 
* Storage quota management utilities
 */
class StorageQuotaManager {
  private static readonly BYTES_PER_MB = 1024 * 1024;

  /**
   * Get current storage usage and quota
   */
  static async getStorageEstimate(): Promise<StorageUsage> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const quota = estimate.quota || 0;
        const used = estimate.usage || 0;
        const available = quota - used;
        const percentage = quota > 0 ? (used / quota) * 100 : 0;

        return { used, available, quota, percentage };
      }
    } catch (error) {
      console.warn('Failed to get storage estimate:', error);
    }

    // Fallback values
    return {
      used: 0,
      available: 50 * this.BYTES_PER_MB, // Assume 50MB available
      quota: 50 * this.BYTES_PER_MB,
      percentage: 0
    };
  }

  /**
   * Check if storage quota is exceeded
   */
  static async isQuotaExceeded(): Promise<boolean> {
    const usage = await this.getStorageEstimate();
    return usage.percentage > (storageQuotaConfig.criticalThreshold * 100);
  }

  /**
   * Check if storage is approaching quota limit
   */
  static async isApproachingQuota(): Promise<boolean> {
    const usage = await this.getStorageEstimate();
    return usage.percentage > (storageQuotaConfig.warningThreshold * 100);
  }

  /**
   * Calculate how much space needs to be freed
   */
  static async calculateSpaceToFree(): Promise<number> {
    const usage = await this.getStorageEstimate();
    const targetPercentage = 1 - storageQuotaConfig.cleanupStrategy.cleanupPercentage;
    const targetUsage = usage.quota * targetPercentage;
    return Math.max(0, usage.used - targetUsage);
  }
}

/**
 * Garbage collection for cache cleanup
 */
class CacheGarbageCollector {
  private db: DharmaCacheDB;

  constructor(db: DharmaCacheDB) {
    this.db = db;
  }

  /**
   * Perform garbage collection based on priority and LRU
   */
  async performCleanup(spaceToFree: number): Promise<number> {
    let freedSpace = 0;
    const config = storageQuotaConfig.cleanupStrategy;

    // Step 1: Remove expired entries
    if (config.removeExpiredFirst) {
      const expiredCount = await this.db.cleanupExpired();
      console.log(`Removed ${expiredCount} expired cache entries`);
    }

    // Step 2: Remove entries by priority (low to high)
    if (freedSpace < spaceToFree && config.useLRU) {
      for (const priority of config.priorityOrder) {
        if (freedSpace >= spaceToFree) break;
        
        const removedSpace = await this.removeEntriesByPriority(priority as CachePriority);
        freedSpace += removedSpace;
      }
    }

    return freedSpace;
  }

  /**
   * Remove cache entries by priority level
   */
  private async removeEntriesByPriority(priority: CachePriority): Promise<number> {
    let removedSpace = 0;

    try {
      // Get entries with specified priority, ordered by timestamp (LRU)
      const entriesToRemove = await this.db.cacheEntries
        .where('priority')
        .equals(priority)
        .limit(10) // Remove in batches
        .toArray();

      if (entriesToRemove.length > 0) {
        // Calculate space that will be freed
        removedSpace = entriesToRemove.reduce((sum: number, entry) => sum + (entry.size || 0), 0);
        
        // Remove entries
        await this.db.cacheEntries.bulkDelete(entriesToRemove.map((e) => e.id!));
        
        console.log(`Removed ${entriesToRemove.length} ${priority} priority entries, freed ${removedSpace} bytes`);
      }
    } catch (error) {
      console.error(`Failed to remove ${priority} priority entries:`, error);
    }

    return removedSpace;
  }

  /**
   * Remove least recently used entries
   */
  async removeLRUEntries(count: number): Promise<number> {
    let removedSpace = 0;

    try {
      const lruEntries = await this.db.cacheEntries
        .limit(count)
        .toArray();

      if (lruEntries.length > 0) {
        removedSpace = lruEntries.reduce((sum, entry) => sum + (entry.size || 0), 0);
        await this.db.cacheEntries.bulkDelete(lruEntries.map(e => e.id!));
        
        console.log(`Removed ${lruEntries.length} LRU entries, freed ${removedSpace} bytes`);
      }
    } catch (error) {
      console.error('Failed to remove LRU entries:', error);
    }

    return removedSpace;
  }
}/**
 * 
Main Storage Manager Implementation
 */
export class StorageManager implements IStorageManager {
  private db: DharmaCacheDB;
  private cacheApi: Cache | null = null;
  private garbageCollector: CacheGarbageCollector;
  private config = getCurrentConfig();

  constructor() {
    this.db = getCacheDB();
    this.garbageCollector = new CacheGarbageCollector(this.db);
    this.initializeCacheAPI();
  }

  /**
   * Initialize Cache API
   */
  private async initializeCacheAPI(): Promise<void> {
    try {
      if ('caches' in window) {
        this.cacheApi = await caches.open('dharma-cache-v1');
      }
    } catch (error) {
      console.warn('Cache API not available:', error);
    }
  }

  /**
   * Store data with options
   */
  async set(key: string, value: unknown, options: StorageOptions = {}): Promise<void> {
    try {
      // Check storage quota before storing
      if (await StorageQuotaManager.isQuotaExceeded()) {
        await this.enforceQuota();
      }

      const now = Date.now();
      const ttl = options.ttl || this.config.defaultTtl;
      const priority = options.priority || 'medium';
      
      let dataToStore = value;

      // Compress data if enabled and above threshold
      if (options.compress && this.config.compression.enabled) {
        if (CompressionUtils.shouldCompress(value, this.config.compression.threshold)) {
          const textData = typeof value === 'string' ? value : JSON.stringify(value);
          const compressedBlob = await CompressionUtils.compressText(textData);
          dataToStore = {
            __compressed: true,
            data: compressedBlob
          };

        }
      }

      // Calculate size
      const size = this.calculateDataSize(dataToStore);

      // Create cache entry
      const entry: CacheEntry = {
        key,
        data: dataToStore,
        timestamp: now,
        ttl,
        version: '1.0.0',
        priority,
        size
      };

      // Store in IndexedDB
      await this.db.storeCacheEntry(entry);

      // Also store in Cache API for HTTP responses if applicable
      if (this.cacheApi && this.isHttpCacheable(key)) {
        await this.storeInCacheAPI(key, value);
      }

    } catch (error) {
      console.error('Failed to store data:', error);
      
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const cacheError: CacheError = {
          name: 'CacheError',
          message: 'Storage quota exceeded',
          type: 'quota-exceeded',
          details: error
        };
        throw cacheError;
      }
      
      throw error;
    }
  }

  /**
   * Get data by key
   */
  async get(key: string): Promise<unknown | null> {
    try {
      // Try IndexedDB first
      const entry = await this.db.getCacheEntry(key);
      
      if (!entry) {
        // Try Cache API as fallback
        if (this.cacheApi && this.isHttpCacheable(key)) {
          return await this.getFromCacheAPI(key);
        }
        return null;
      }

      // Handle compressed data
      if (this.isCompressedData(entry.data)) {
        const compressedData = entry.data as { __compressed: boolean; data: Blob };
        const decompressedText = await CompressionUtils.decompressText(compressedData.data);
        
        try {
          return JSON.parse(decompressedText);
        } catch {
          return decompressedText;
        }
      }

      return entry.data;

    } catch (error) {
      console.error('Failed to get data:', error);
      return null;
    }
  }

  /**
   * Remove data by key
   */
  async remove(key: string): Promise<void> {
    try {
      // Remove from IndexedDB
      await this.db.cacheEntries.where('key').equals(key).delete();
      
      // Remove from Cache API if applicable
      if (this.cacheApi && this.isHttpCacheable(key)) {
        await this.cacheApi.delete(key);
      }

    } catch (error) {
      console.error('Failed to remove data:', error);
      throw error;
    }
  }

  /**
   * Clear all data
   */
  async clear(): Promise<void> {
    try {
      await this.db.clearAllCache();
      
      if (this.cacheApi) {
        const keys = await this.cacheApi.keys();
        await Promise.all(keys.map(request => this.cacheApi!.delete(request)));
      }

    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  /**
   * Get storage usage information
   */
  async getStorageUsage(): Promise<StorageUsage> {
    return await StorageQuotaManager.getStorageEstimate();
  }

  /**
   * Perform cleanup of expired and low-priority entries
   */
  async cleanup(): Promise<void> {
    try {
      // Remove expired entries
      const expiredCount = await this.db.cleanupExpired();
      console.log(`Cleaned up ${expiredCount} expired entries`);

      // Check if we need to free more space
      if (await StorageQuotaManager.isApproachingQuota()) {
        const spaceToFree = await StorageQuotaManager.calculateSpaceToFree();
        const freedSpace = await this.garbageCollector.performCleanup(spaceToFree);
        console.log(`Freed ${freedSpace} bytes during cleanup`);
      }

    } catch (error) {
      console.error('Failed to perform cleanup:', error);
      throw error;
    }
  }

  /**
   * Enforce storage quota by removing entries
   */
  async enforceQuota(): Promise<void> {
    try {
      const spaceToFree = await StorageQuotaManager.calculateSpaceToFree();
      
      if (spaceToFree > 0) {
        const freedSpace = await this.garbageCollector.performCleanup(spaceToFree);
        
        if (freedSpace < spaceToFree) {
          console.warn(`Only freed ${freedSpace} bytes, needed ${spaceToFree} bytes`);
        }
      }

    } catch (error) {
      console.error('Failed to enforce quota:', error);
      throw error;
    }
  } 
 /**
   * Batch operations for efficiency
   */
  async setBatch(entries: Array<{ key: string; value: unknown; options?: StorageOptions }>): Promise<void> {
    try {
      // Check quota before batch operation
      if (await StorageQuotaManager.isQuotaExceeded()) {
        await this.enforceQuota();
      }

      const cacheEntries: CacheEntry[] = [];
      const now = Date.now();

      for (const { key, value, options = {} } of entries) {
        const ttl = options.ttl || this.config.defaultTtl;
        const priority = options.priority || 'medium';
        
        let dataToStore = value;

        // Handle compression
        if (options.compress && this.config.compression.enabled) {
          if (CompressionUtils.shouldCompress(value, this.config.compression.threshold)) {
            const textData = typeof value === 'string' ? value : JSON.stringify(value);
            const compressedBlob = await CompressionUtils.compressText(textData);
            dataToStore = {
              __compressed: true,
              data: compressedBlob
            };
          }
        }

        const entry: CacheEntry = {
          key,
          data: dataToStore,
          timestamp: now,
          ttl,
          version: '1.0.0',
          priority,
          size: this.calculateDataSize(dataToStore)
        };

        cacheEntries.push(entry);
      }

      // Batch insert into IndexedDB
      await this.db.cacheEntries.bulkPut(cacheEntries);

    } catch (error) {
      console.error('Failed to perform batch set:', error);
      throw error;
    }
  }

  /**
   * Get multiple entries by keys
   */
  async getBatch(keys: string[]): Promise<Array<unknown | null>> {
    try {
      const results: Array<unknown | null> = [];
      
      for (const key of keys) {
        const value = await this.get(key);
        results.push(value);
      }

      return results;

    } catch (error) {
      console.error('Failed to perform batch get:', error);
      throw error;
    }
  }

  /**
   * Remove multiple entries by keys
   */
  async removeBatch(keys: string[]): Promise<void> {
    try {
      // Remove from IndexedDB
      await this.db.cacheEntries.where('key').anyOf(keys).delete();
      
      // Remove from Cache API if applicable
      if (this.cacheApi) {
        const cacheableKeys = keys.filter(key => this.isHttpCacheable(key));
        await Promise.all(cacheableKeys.map(key => this.cacheApi!.delete(key)));
      }

    } catch (error) {
      console.error('Failed to perform batch remove:', error);
      throw error;
    }
  }

  /**
   * Private helper methods
   */

  /**
   * Check if data is compressed
   */
  private isCompressedData(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      '__compressed' in data &&
      (data as { __compressed: boolean }).__compressed === true
    );
  }

  /**
   * Check if key represents HTTP cacheable content
   */
  private isHttpCacheable(key: string): boolean {
    return key.startsWith('api:') || key.startsWith('asset:');
  }

  /**
   * Store data in Cache API
   */
  private async storeInCacheAPI(key: string, value: unknown): Promise<void> {
    if (!this.cacheApi) return;

    try {
      const response = new Response(JSON.stringify(value), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `max-age=${this.config.defaultTtl / 1000}`
        }
      });

      await this.cacheApi.put(key, response);
    } catch (error) {
      console.warn('Failed to store in Cache API:', error);
    }
  }

  /**
   * Get data from Cache API
   */
  private async getFromCacheAPI(key: string): Promise<unknown | null> {
    if (!this.cacheApi) return null;

    try {
      const response = await this.cacheApi.match(key);
      if (response) {
        const text = await response.text();
        return JSON.parse(text);
      }
    } catch (error) {
      console.warn('Failed to get from Cache API:', error);
    }

    return null;
  }

  /**
   * Calculate data size for storage tracking
   */
  private calculateDataSize(data: unknown): number {
    try {
      if (data instanceof Blob) {
        return data.size;
      }
      
      if (this.isCompressedData(data)) {
        const compressedData = data as { data: Blob };
        return compressedData.data.size;
      }
      
      const jsonString = JSON.stringify(data);
      return new Blob([jsonString]).size;
      
    } catch (error) {
      console.warn('Failed to calculate data size:', error);
      return 0;
    }
  }
}

// Export utilities
export { CompressionUtils, StorageQuotaManager, CacheGarbageCollector };