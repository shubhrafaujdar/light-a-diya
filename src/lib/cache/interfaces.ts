/**
 * Cache Management System Interfaces
 * Core interfaces for the caching infrastructure
 */

import {
  CacheStats,
  CacheType,
  StorageOptions,
  StorageUsage,
  SyncResult,
  SyncType,
  OfflineAction,
  SpiritualContentCache,
  CachePerformanceMetrics
} from '@/types/cache';

/**
 * Main Cache Manager Interface
 */
export interface CacheManager {
  // Content caching
  cacheContent(key: string, content: unknown): Promise<void>;
  getContent(key: string): Promise<unknown | null>;
  
  // API response caching
  cacheApiResponse(url: string, response: unknown, ttl?: number): Promise<void>;
  getApiResponse(url: string): Promise<unknown | null>;
  
  // Asset caching
  cacheAsset(url: string, blob: Blob): Promise<void>;
  getAsset(url: string): Promise<Blob | null>;
  
  // Cache management
  clearCache(type?: CacheType): Promise<void>;
  getCacheStats(): Promise<CacheStats>;
  
  // Cache validation
  isValid(key: string): Promise<boolean>;
  invalidate(key: string): Promise<void>;
}

/**
 * Storage Manager Interface
 */
export interface StorageManager {
  // Storage operations
  set(key: string, value: unknown, options?: StorageOptions): Promise<void>;
  get(key: string): Promise<unknown | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  
  // Storage management
  getStorageUsage(): Promise<StorageUsage>;
  cleanup(): Promise<void>;
  enforceQuota(): Promise<void>;
  
  // Batch operations
  setBatch(entries: Array<{ key: string; value: unknown; options?: StorageOptions }>): Promise<void>;
  getBatch(keys: string[]): Promise<Array<unknown | null>>;
  removeBatch(keys: string[]): Promise<void>;
}

/**
 * Sync Manager Interface
 */
export interface SyncManager {
  // Background sync
  scheduleSync(type: SyncType): Promise<void>;
  performSync(): Promise<SyncResult>;
  
  // Content freshness
  checkContentFreshness(key: string): Promise<boolean>;
  invalidateContent(key: string): Promise<void>;
  
  // Offline handling
  queueOfflineAction(action: OfflineAction): Promise<void>;
  processOfflineQueue(): Promise<void>;
  
  // Sync status
  getSyncStatus(): Promise<{ lastSync: number; pending: number; failed: number }>;
}

/**
 * Content Manager Interface
 */
export interface ContentManager {
  // Spiritual content operations
  cacheAarti(aartiId: string, content: SpiritualContentCache['data']): Promise<void>;
  getAarti(aartiId: string): Promise<SpiritualContentCache['data'] | null>;
  
  cacheDeity(deityId: string, deity: unknown): Promise<void>;
  getDeity(deityId: string): Promise<unknown | null>;
  
  // Bilingual content
  cacheBilingualContent(contentId: string, hindi: unknown, english: unknown): Promise<void>;
  getBilingualContent(contentId: string): Promise<{ hindi: unknown; english: unknown } | null>;
  
  // Offline content management
  getOfflineContent(): Promise<SpiritualContentCache[]>;
  preloadEssentialContent(): Promise<void>;
  
  // Content versioning
  updateContentVersion(contentId: string, version: string): Promise<void>;
  getContentVersion(contentId: string): Promise<string | null>;
}

/**
 * Asset Manager Interface
 */
export interface AssetManager {
  // Image caching
  cacheImage(url: string, blob: Blob): Promise<void>;
  getImage(url: string): Promise<Blob | null>;
  
  // Font caching
  cacheFont(url: string, blob: Blob): Promise<void>;
  getFont(url: string): Promise<Blob | null>;
  
  // Stylesheet caching
  cacheStylesheet(url: string, css: string): Promise<void>;
  getStylesheet(url: string): Promise<string | null>;
  
  // Asset optimization
  optimizeImage(blob: Blob, options?: { quality?: number; format?: string }): Promise<Blob>;
  compressAsset(blob: Blob): Promise<Blob>;
  
  // Preloading
  preloadCriticalAssets(): Promise<void>;
  preloadAsset(url: string): Promise<void>;
}

/**
 * Query Manager Interface (TanStack Query integration)
 */
export interface QueryManager {
  // Query caching
  getCachedQuery(queryKey: string[]): Promise<unknown | null>;
  setCachedQuery(queryKey: string[], data: unknown, options?: { staleTime?: number }): Promise<void>;
  
  // Query invalidation
  invalidateQueries(queryKey?: string[]): Promise<void>;
  refetchQueries(queryKey?: string[]): Promise<void>;
  
  // Offline queries
  getOfflineQueries(): Promise<Array<{ queryKey: string[]; data: unknown }>>;
  setOfflineQuery(queryKey: string[], data: unknown): Promise<void>;
}

/**
 * Performance Monitor Interface
 */
export interface PerformanceMonitor {
  // Metrics collection
  recordCacheHit(key: string, responseTime: number): void;
  recordCacheMiss(key: string): void;
  
  // Performance metrics
  getMetrics(): Promise<CachePerformanceMetrics>;
  resetMetrics(): Promise<void>;
  
  // Monitoring
  startMonitoring(): void;
  stopMonitoring(): void;
  
  // Reporting
  generateReport(): Promise<{
    summary: CachePerformanceMetrics;
    details: Array<{ key: string; hits: number; misses: number; avgResponseTime: number }>;
  }>;
}

/**
 * Cache Error Handler Interface
 */
export interface CacheErrorHandler {
  handleStorageQuotaExceeded(): Promise<void>;
  handleCorruptedCache(): Promise<void>;
  handleNetworkFailure(): Promise<void>;
  handleServiceWorkerError(): Promise<void>;
  
  // Error recovery
  recoverFromError(error: Error): Promise<boolean>;
  fallbackToOfflineContent(): Promise<void>;
}

/**
 * Preload Strategy Interface
 */
export interface PreloadStrategy {
  // Content preloading
  preloadRelatedAartis(deityId: string): Promise<void>;
  preloadPopularContent(): Promise<void>;
  preloadOfflineEssentials(): Promise<void>;
  
  // Smart preloading
  preloadBasedOnUserBehavior(userId?: string): Promise<void>;
  preloadCriticalPath(): Promise<void>;
  
  // Preload management
  cancelPreload(type: string): Promise<void>;
  getPreloadStatus(): Promise<{ active: string[]; completed: string[]; failed: string[] }>;
}