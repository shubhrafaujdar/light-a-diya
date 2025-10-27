/**
 * TanStack Query Configuration
 * Sets up React Query for client-side data fetching and caching
 */

import { QueryClient, QueryClientConfig } from '@tanstack/react-query';
import { CacheConfig } from '@/types/cache';

/**
 * Default cache configuration
 */
const defaultCacheConfig: CacheConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  defaultTtl: 5 * 60 * 1000, // 5 minutes for API
  strategies: {
    content: 'stale-while-revalidate',
    api: 'network-first',
    assets: 'cache-first'
  },
  offline: {
    maxItems: 10, // 10 most recent aartis
    essentialContent: ['deities', 'popular-aartis']
  },
  compression: {
    enabled: true,
    threshold: 1024 // Compress items larger than 1KB
  }
};

/**
 * Query Client Configuration
 */
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: defaultCacheConfig.defaultTtl,
      // Keep data in cache for 24 hours
      gcTime: 24 * 60 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default (we'll handle this manually)
      refetchOnReconnect: false,
      // Network mode for offline handling
      networkMode: 'offlineFirst'
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Network mode for offline handling
      networkMode: 'offlineFirst'
    }
  }
};

/**
 * Create and configure the Query Client
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient(queryClientConfig);
};

/**
 * Singleton Query Client instance
 */
let queryClient: QueryClient | null = null;

export const getQueryClient = (): QueryClient => {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
};

/**
 * Query Keys for different types of data
 */
export const queryKeys = {
  // Deity-related queries
  deities: ['deities'] as const,
  deity: (id: string) => ['deities', id] as const,
  deityAartis: (deityId: string) => ['deities', deityId, 'aartis'] as const,
  
  // Aarti-related queries
  aartis: ['aartis'] as const,
  aarti: (id: string) => ['aartis', id] as const,
  aartiContent: (id: string, language: string) => ['aartis', id, 'content', language] as const,
  
  // Search queries
  search: (query: string) => ['search', query] as const,
  searchResults: (query: string, filters?: unknown) => ['search', query, filters] as const,
  
  // User-related queries
  user: ['user'] as const,
  userPreferences: ['user', 'preferences'] as const,
  userFavorites: ['user', 'favorites'] as const,
  
  // Content metadata
  contentVersion: (contentId: string) => ['content', contentId, 'version'] as const,
  contentMetadata: (contentId: string) => ['content', contentId, 'metadata'] as const
} as const;

/**
 * Cache invalidation helpers
 */
export const cacheInvalidation = {
  // Invalidate all deity-related data
  invalidateDeities: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.deities });
  },
  
  // Invalidate specific deity data
  invalidateDeity: (queryClient: QueryClient, deityId: string) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.deity(deityId) });
  },
  
  // Invalidate all aarti data
  invalidateAartis: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.aartis });
  },
  
  // Invalidate specific aarti data
  invalidateAarti: (queryClient: QueryClient, aartiId: string) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.aarti(aartiId) });
  },
  
  // Invalidate search results
  invalidateSearch: (queryClient: QueryClient, query?: string) => {
    if (query) {
      return queryClient.invalidateQueries({ queryKey: queryKeys.search(query) });
    }
    return queryClient.invalidateQueries({ queryKey: ['search'] });
  },
  
  // Invalidate user data
  invalidateUser: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.user });
  }
};

/**
 * Offline query management
 */
export const offlineQueries = {
  // Get offline-available queries
  getOfflineQueries: (queryClient: QueryClient) => {
    const queryCache = queryClient.getQueryCache();
    return queryCache.getAll().filter(query => {
      // Check if query data is available and not stale
      return query.state.data && query.state.dataUpdatedAt > Date.now() - (24 * 60 * 60 * 1000);
    });
  },
  
  // Preload essential queries for offline use
  preloadEssentialQueries: async (queryClient: QueryClient) => {
    // Preload deities list
    await queryClient.prefetchQuery({
      queryKey: queryKeys.deities,
      queryFn: () => fetch('/api/deities').then(res => res.json()),
      staleTime: 24 * 60 * 60 * 1000 // Cache for 24 hours
    });
    
    // Preload popular aartis (this would be determined by analytics)
    // For now, we'll just preload the first few
    const popularAartiIds = ['1', '2', '3', '4', '5']; // This should come from analytics
    
    for (const aartiId of popularAartiIds) {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.aarti(aartiId),
        queryFn: () => fetch(`/api/aartis/${aartiId}`).then(res => res.json()),
        staleTime: 24 * 60 * 60 * 1000
      });
    }
  }
};

/**
 * Query client utilities
 */
export const queryUtils = {
  // Check if data is cached
  isCached: (queryClient: QueryClient, queryKey: readonly unknown[]) => {
    const query = queryClient.getQueryCache().find({ queryKey });
    return query?.state.data !== undefined;
  },
  
  // Get cached data without triggering a fetch
  getCachedData: (queryClient: QueryClient, queryKey: readonly unknown[]) => {
    return queryClient.getQueryData(queryKey);
  },
  
  // Set data in cache
  setCachedData: (queryClient: QueryClient, queryKey: readonly unknown[], data: unknown) => {
    queryClient.setQueryData(queryKey, data);
  },
  
  // Remove data from cache
  removeCachedData: (queryClient: QueryClient, queryKey: readonly unknown[]) => {
    queryClient.removeQueries({ queryKey });
  },
  
  // Get cache statistics
  getCacheStats: (queryClient: QueryClient) => {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    return {
      totalQueries: queries.length,
      cachedQueries: queries.filter(q => q.state.data !== undefined).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      fetchingQueries: queries.filter(q => q.state.fetchStatus === 'fetching').length
    };
  }
};

export { defaultCacheConfig };