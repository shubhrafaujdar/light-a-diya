/**
 * IndexedDB Configuration with Dexie.js
 * Structured data storage for spiritual content and cache management
 */

import Dexie, { Table } from 'dexie';
import {
  CacheEntry,
  SpiritualContentCache,
  ApiResponseCache,
  AssetCache,
  ContentVersion,
  OfflineAction,
  CachePerformanceMetrics
} from '@/types/cache';

/**
 * Database Schema Interfaces
 */
export interface CacheEntryDB extends CacheEntry {
  id?: number;
}

export interface SpiritualContentDB extends Omit<SpiritualContentCache, 'data'> {
  id?: number;
  data: string; // JSON stringified data
}

export interface ApiResponseDB extends Omit<ApiResponseCache, 'data'> {
  id?: number;
  data: string; // JSON stringified data
}

export interface AssetCacheDB extends Omit<AssetCache, 'data'> {
  id?: number;
  blob: Blob;
  mimeType: string;
  url: string;
}

export interface ContentVersionDB extends ContentVersion {
  id?: number;
}

export interface OfflineActionDB extends Omit<OfflineAction, 'id'> {
  id?: number;
  actionId: string; // Original id from OfflineAction
}

export interface PerformanceMetricsDB extends CachePerformanceMetrics {
  id?: number;
}

/**
 * Dharma Cache Database
 */
export class DharmaCacheDB extends Dexie {
  // Cache tables
  cacheEntries!: Table<CacheEntryDB>;
  spiritualContent!: Table<SpiritualContentDB>;
  apiResponses!: Table<ApiResponseDB>;
  assetCache!: Table<AssetCacheDB>;
  
  // Metadata tables
  contentVersions!: Table<ContentVersionDB>;
  offlineActions!: Table<OfflineActionDB>;
  performanceMetrics!: Table<PerformanceMetricsDB>;

  constructor() {
    super('DharmaCacheDB');
    
    this.version(1).stores({
      // Cache entries with compound indexes for efficient querying
      cacheEntries: '++id, key, timestamp, ttl, priority, [key+version]',
      
      // Spiritual content with indexes for deities and aartis
      spiritualContent: '++id, key, timestamp, ttl, priority, [key+version]',
      
      // API responses with URL-based indexing
      apiResponses: '++id, key, timestamp, ttl, [key+version]',
      
      // Asset cache with URL and MIME type indexing
      assetCache: '++id, key, url, mimeType, timestamp, ttl, size',
      
      // Content versions for freshness checking
      contentVersions: '++id, contentId, version, lastModified, etag',
      
      // Offline actions queue
      offlineActions: '++id, type, endpoint, timestamp',
      
      // Performance metrics
      performanceMetrics: '++id, lastMeasurement'
    });

    // Hooks for automatic cleanup and compression
    this.cacheEntries.hook('creating', (primKey, obj) => {
      obj.timestamp = Date.now();
    });

    this.spiritualContent.hook('creating', (primKey, obj) => {
      obj.timestamp = Date.now();
    });

    this.apiResponses.hook('creating', (primKey, obj) => {
      obj.timestamp = Date.now();
    });

    this.assetCache.hook('creating', (primKey, obj) => {
      obj.timestamp = Date.now();
    });
  }

  /**
   * Cache Management Methods
   */

  // Store cache entry
  async storeCacheEntry(entry: CacheEntry): Promise<void> {
    await this.cacheEntries.put({
      ...entry,
      timestamp: Date.now()
    });
  }

  // Get cache entry
  async getCacheEntry(key: string): Promise<CacheEntry | null> {
    const entry = await this.cacheEntries.where('key').equals(key).first();
    if (!entry) return null;

    // Check if entry is expired
    if (this.isExpired(entry)) {
      await this.cacheEntries.where('key').equals(key).delete();
      return null;
    }

    return entry;
  }

  // Store spiritual content
  async storeSpiritualContent(content: SpiritualContentCache): Promise<void> {
    await this.spiritualContent.put({
      ...content,
      data: JSON.stringify(content.data),
      timestamp: Date.now()
    });
  }

  // Get spiritual content
  async getSpiritualContent(key: string): Promise<SpiritualContentCache | null> {
    const entry = await this.spiritualContent.where('key').equals(key).first();
    if (!entry) return null;

    // Check if entry is expired
    if (this.isExpired(entry)) {
      await this.spiritualContent.where('key').equals(key).delete();
      return null;
    }

    return {
      ...entry,
      data: JSON.parse(entry.data)
    };
  }

  // Store API response
  async storeApiResponse(response: ApiResponseCache): Promise<void> {
    await this.apiResponses.put({
      ...response,
      data: JSON.stringify(response.data),
      timestamp: Date.now()
    });
  }

  // Get API response
  async getApiResponse(key: string): Promise<ApiResponseCache | null> {
    const entry = await this.apiResponses.where('key').equals(key).first();
    if (!entry) return null;

    // Check if entry is expired
    if (this.isExpired(entry)) {
      await this.apiResponses.where('key').equals(key).delete();
      return null;
    }

    return {
      ...entry,
      data: JSON.parse(entry.data)
    };
  }

  // Store asset
  async storeAsset(asset: AssetCache): Promise<void> {
    await this.assetCache.put({
      ...asset,
      blob: asset.data.blob,
      mimeType: asset.data.mimeType,
      url: asset.data.url,
      timestamp: Date.now()
    });
  }

  // Get asset
  async getAsset(key: string): Promise<AssetCache | null> {
    const entry = await this.assetCache.where('key').equals(key).first();
    if (!entry) return null;

    // Check if entry is expired
    if (this.isExpired(entry)) {
      await this.assetCache.where('key').equals(key).delete();
      return null;
    }

    return {
      ...entry,
      data: {
        blob: entry.blob,
        mimeType: entry.mimeType,
        url: entry.url
      }
    };
  }

  /**
   * Content Version Management
   */

  // Store content version
  async storeContentVersion(version: ContentVersion): Promise<void> {
    await this.contentVersions.put(version);
  }

  // Get content version
  async getContentVersion(contentId: string): Promise<ContentVersion | null> {
    return await this.contentVersions.where('contentId').equals(contentId).first() || null;
  }

  /**
   * Offline Actions Management
   */

  // Queue offline action
  async queueOfflineAction(action: OfflineAction): Promise<void> {
    const { id, ...actionWithoutId } = action;
    const dbAction: OfflineActionDB = {
      ...actionWithoutId,
      actionId: id
    };
    await this.offlineActions.put(dbAction);
  }

  // Get offline actions
  async getOfflineActions(): Promise<OfflineAction[]> {
    const dbActions = await this.offlineActions.orderBy('timestamp').toArray();
    return dbActions.map(dbAction => ({
      id: dbAction.actionId,
      type: dbAction.type,
      endpoint: dbAction.endpoint,
      data: dbAction.data,
      timestamp: dbAction.timestamp
    }));
  }

  // Remove offline action
  async removeOfflineAction(id: string): Promise<void> {
    await this.offlineActions.where('actionId').equals(id).delete();
  }

  /**
   * Performance Metrics
   */

  // Store performance metrics
  async storePerformanceMetrics(metrics: CachePerformanceMetrics): Promise<void> {
    await this.performanceMetrics.put(metrics);
  }

  // Get latest performance metrics
  async getLatestPerformanceMetrics(): Promise<CachePerformanceMetrics | null> {
    return await this.performanceMetrics.orderBy('lastMeasurement').last() || null;
  }

  /**
   * Utility Methods
   */

  // Check if cache entry is expired
  private isExpired(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() > (entry.timestamp + entry.ttl);
  }

  // Get storage usage statistics
  async getStorageStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    entriesByType: Record<string, number>;
  }> {
    const [cacheEntries, spiritualContent, apiResponses, assetCache] = await Promise.all([
      this.cacheEntries.count(),
      this.spiritualContent.count(),
      this.apiResponses.count(),
      this.assetCache.count()
    ]);

    // Calculate approximate size (this is an estimation)
    const totalSize = await this.calculateApproximateSize();

    return {
      totalEntries: cacheEntries + spiritualContent + apiResponses + assetCache,
      totalSize,
      entriesByType: {
        cacheEntries,
        spiritualContent,
        apiResponses,
        assetCache
      }
    };
  }

  // Calculate approximate storage size
  private async calculateApproximateSize(): Promise<number> {
    let totalSize = 0;

    // This is a rough estimation - in a real implementation,
    // you might want to store actual sizes with each entry
    const [cacheEntries, spiritualContent, apiResponses, assets] = await Promise.all([
      this.cacheEntries.toArray(),
      this.spiritualContent.toArray(),
      this.apiResponses.toArray(),
      this.assetCache.toArray()
    ]);

    // Estimate sizes (very rough)
    totalSize += cacheEntries.length * 1024; // ~1KB per cache entry
    totalSize += spiritualContent.reduce((sum, item) => sum + item.size, 0);
    totalSize += apiResponses.reduce((sum, item) => sum + item.size, 0);
    totalSize += assets.reduce((sum, item) => sum + item.size, 0);

    return totalSize;
  }

  // Cleanup expired entries
  async cleanupExpired(): Promise<number> {
    const now = Date.now();
    let deletedCount = 0;

    // Clean up cache entries
    const expiredCacheEntries = await this.cacheEntries
      .filter(entry => now > (entry.timestamp + entry.ttl))
      .toArray();
    
    if (expiredCacheEntries.length > 0) {
      await this.cacheEntries.bulkDelete(expiredCacheEntries.map(e => e.id!));
      deletedCount += expiredCacheEntries.length;
    }

    // Clean up spiritual content
    const expiredSpiritualContent = await this.spiritualContent
      .filter(entry => now > (entry.timestamp + entry.ttl))
      .toArray();
    
    if (expiredSpiritualContent.length > 0) {
      await this.spiritualContent.bulkDelete(expiredSpiritualContent.map(e => e.id!));
      deletedCount += expiredSpiritualContent.length;
    }

    // Clean up API responses
    const expiredApiResponses = await this.apiResponses
      .filter(entry => now > (entry.timestamp + entry.ttl))
      .toArray();
    
    if (expiredApiResponses.length > 0) {
      await this.apiResponses.bulkDelete(expiredApiResponses.map(e => e.id!));
      deletedCount += expiredApiResponses.length;
    }

    // Clean up assets
    const expiredAssets = await this.assetCache
      .filter(entry => now > (entry.timestamp + entry.ttl))
      .toArray();
    
    if (expiredAssets.length > 0) {
      await this.assetCache.bulkDelete(expiredAssets.map(e => e.id!));
      deletedCount += expiredAssets.length;
    }

    return deletedCount;
  }

  // Clear all cache data
  async clearAllCache(): Promise<void> {
    await Promise.all([
      this.cacheEntries.clear(),
      this.spiritualContent.clear(),
      this.apiResponses.clear(),
      this.assetCache.clear()
    ]);
  }

  // Clear cache by type
  async clearCacheByType(type: 'content' | 'api' | 'assets'): Promise<void> {
    switch (type) {
      case 'content':
        await this.spiritualContent.clear();
        break;
      case 'api':
        await this.apiResponses.clear();
        break;
      case 'assets':
        await this.assetCache.clear();
        break;
    }
  }
}

// Singleton instance
let dbInstance: DharmaCacheDB | null = null;

export const getCacheDB = (): DharmaCacheDB => {
  if (!dbInstance) {
    dbInstance = new DharmaCacheDB();
  }
  return dbInstance;
};

export default DharmaCacheDB;