/**
 * Cache Management System Types
 * Defines interfaces and types for the client-side caching infrastructure
 */

// Cache Priority Levels
export type CachePriority = 'high' | 'medium' | 'low';

// Cache Storage Types
export type CacheStorageType = 'indexeddb' | 'cache-api' | 'localstorage';

// Cache Strategies
export type CacheStrategy = 
  | 'cache-first' 
  | 'network-first' 
  | 'stale-while-revalidate'
  | 'network-only'
  | 'cache-only';

// Sync Types
export type SyncType = 'content' | 'api' | 'assets' | 'user-preferences';

// Cache Types
export type CacheType = 'content' | 'api' | 'assets' | 'all';

/**
 * Base Cache Entry Interface
 */
export interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
  etag?: string;
  lastModified?: string;
  priority: CachePriority;
  size: number;
}

/**
 * Spiritual Content Cache Entry
 */
export interface SpiritualContentCache extends CacheEntry {
  data: {
    deity: DeityInfo;
    aarti: AartiContent;
    translations: LanguageTranslations;
    images: ImageCache[];
  };
}

/**
 * API Response Cache Entry
 */
export interface ApiResponseCache extends CacheEntry {
  data: {
    response: unknown;
    headers: Record<string, string>;
    status: number;
  };
}

/**
 * Asset Cache Entry
 */
export interface AssetCache extends CacheEntry {
  data: {
    blob: Blob;
    mimeType: string;
    url: string;
  };
}

/**
 * Cache Statistics
 */
export interface CacheStats {
  totalSize: number;
  totalEntries: number;
  hitRate: number;
  missRate: number;
  storageUsage: {
    indexeddb: number;
    cacheApi: number;
    localStorage: number;
  };
  lastCleanup: number;
}

/**
 * Storage Usage Information
 */
export interface StorageUsage {
  used: number;
  available: number;
  quota: number;
  percentage: number;
}

/**
 * Storage Options
 */
export interface StorageOptions {
  ttl?: number; // Time to live in milliseconds
  priority?: CachePriority;
  compress?: boolean;
  strategy?: CacheStrategy;
}

/**
 * Cache Configuration
 */
export interface CacheConfig {
  maxSize: number; // 50MB default
  defaultTtl: number; // 5 minutes for API, 24 hours for content
  strategies: {
    content: CacheStrategy;
    api: CacheStrategy;
    assets: CacheStrategy;
  };
  offline: {
    maxItems: number; // 10 most recent aartis
    essentialContent: string[]; // Always cache these
  };
  compression: {
    enabled: boolean;
    threshold: number; // Compress items larger than this size
  };
}

/**
 * Content Version Information
 */
export interface ContentVersion {
  contentId: string;
  version: string;
  lastModified: string;
  etag: string;
}

/**
 * Sync Result
 */
export interface SyncResult {
  success: boolean;
  updated: string[];
  failed: string[];
  timestamp: number;
}

/**
 * Offline Action
 */
export interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data: unknown;
  timestamp: number;
}

/**
 * Cache Error Types
 */
export interface CacheError extends Error {
  type: 'quota-exceeded' | 'corrupted-data' | 'network-failure' | 'storage-unavailable';
  details?: unknown;
}

/**
 * Spiritual Content Types (extending existing types)
 */
export interface DeityInfo {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface AartiContent {
  id: string;
  deity_id: string;
  title: string;
  content: string;
  language: 'hindi' | 'english';
  created_at: string;
  updated_at: string;
}

export interface LanguageTranslations {
  hindi?: AartiContent;
  english?: AartiContent;
}

export interface ImageCache {
  url: string;
  blob: Blob;
  mimeType: string;
  size: number;
}

/**
 * Performance Metrics
 */
export interface CachePerformanceMetrics {
  hitRate: number;
  missRate: number;
  averageResponseTime: number;
  storageUsage: number;
  offlineAvailability: number;
  lastMeasurement: number;
}

/**
 * Compression Options
 */
export interface CompressionOptions {
  images: {
    format: 'webp' | 'avif' | 'jpeg';
    quality: number;
    progressive: boolean;
  };
  text: {
    gzip: boolean;
    minify: boolean;
  };
}