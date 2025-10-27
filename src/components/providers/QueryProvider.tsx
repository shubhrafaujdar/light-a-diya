/**
 * Query Provider Component
 * Provides TanStack Query context to the application
 */

'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from '@/lib/cache/query-client';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider Component
 * Sets up TanStack Query for the entire application
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create a stable query client instance
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
}

export default QueryProvider;