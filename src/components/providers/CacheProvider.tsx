/**
 * Cache Provider Component
 * Initializes and provides caching system context
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeCacheSystem, CacheSystemStatus, isCachingSupported } from '@/lib/cache';

interface CacheContextValue {
  status: CacheSystemStatus;
  isSupported: boolean;
  isInitialized: boolean;
  error: string | null;
  reinitialize: () => Promise<void>;
}

const CacheContext = createContext<CacheContextValue | null>(null);

interface CacheProviderProps {
  children: React.ReactNode;
}

/**
 * Cache Provider Component
 * Manages the initialization and status of the caching system
 */
export function CacheProvider({ children }: CacheProviderProps) {
  const [status, setStatus] = useState<CacheSystemStatus>({
    initialized: false,
    serviceWorkerActive: false,
    indexedDBAvailable: false,
    queryClientReady: false,
    offlineSupported: false
  });
  
  const [isSupported, setIsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = async () => {
    try {
      setError(null);
      
      // Check if caching is supported
      const supported = isCachingSupported();
      setIsSupported(supported);
      
      if (!supported) {
        setError('Caching is not supported in this environment');
        return;
      }

      // Initialize the cache system
      const initStatus = await initializeCacheSystem();
      setStatus(initStatus);
      setIsInitialized(initStatus.initialized);
      
      if (!initStatus.initialized) {
        setError('Failed to initialize cache system');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Cache system initialization failed:', err);
    }
  };

  const reinitialize = async () => {
    setIsInitialized(false);
    await initialize();
  };

  useEffect(() => {
    // Only initialize on the client side
    if (typeof window !== 'undefined') {
      initialize();
    }
  }, []);

  // Register service worker if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available
                  console.log('New service worker available');
                  
                  // Optionally notify user about update
                  if (window.confirm('A new version is available. Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
          
          setStatus(prev => ({ ...prev, serviceWorkerActive: true }));
          console.log('Service Worker registered successfully');
        } catch (error) {
          console.error('Service Worker registration failed:', error);
          setStatus(prev => ({ ...prev, serviceWorkerActive: false }));
        }
      };

      registerServiceWorker();
    }
  }, []);

  const contextValue: CacheContextValue = {
    status,
    isSupported,
    isInitialized,
    error,
    reinitialize
  };

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}

/**
 * Hook to use cache context
 */
export function useCache(): CacheContextValue {
  const context = useContext(CacheContext);
  
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  
  return context;
}

/**
 * Hook to check if caching is available and ready
 */
export function useCacheReady(): boolean {
  const { isSupported, isInitialized } = useCache();
  return isSupported && isInitialized;
}

/**
 * Hook to get cache system status
 */
export function useCacheStatus(): CacheSystemStatus {
  const { status } = useCache();
  return status;
}

export default CacheProvider;