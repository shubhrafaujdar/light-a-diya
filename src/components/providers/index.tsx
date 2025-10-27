/**
 * Providers Index
 * Combines all providers for the application
 */

'use client';

import React from 'react';
import QueryProvider from './QueryProvider';
import CacheProvider from './CacheProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Combined Providers Component
 * Wraps the application with all necessary providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <CacheProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </CacheProvider>
  );
}

// Re-export individual providers and hooks
export { default as QueryProvider } from './QueryProvider';
export { default as CacheProvider, useCache, useCacheReady, useCacheStatus } from './CacheProvider';

export default Providers;