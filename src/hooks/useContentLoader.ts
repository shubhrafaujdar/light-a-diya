'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseContentLoaderOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

interface ContentLoaderState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retrying: boolean;
  retryCount: number;
}

interface ContentLoaderActions {
  retry: () => void;
  reset: () => void;
}

export function useContentLoader<T>(
  fetchFunction: (signal: AbortSignal) => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseContentLoaderOptions = {}
): ContentLoaderState<T> & ContentLoaderActions {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 10000
  } = options;

  const [state, setState] = useState<ContentLoaderState<T>>({
    data: null,
    loading: true,
    error: null,
    retrying: false,
    retryCount: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
      abortControllerRef.current.abort('Component cleanup');
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const loadContent = useCallback(async (isRetry = false) => {
    cleanup();

    setState(prev => ({
      ...prev,
      loading: !isRetry,
      retrying: isRetry,
      error: null
    }));

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Set up timeout
    timeoutRef.current = setTimeout(() => {
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        abortControllerRef.current.abort('Request timeout');
      }
    }, timeout);

    try {
      const result = await fetchFunction(signal);

      // Only update state if the request wasn't aborted
      if (!signal.aborted) {
        setState(prev => ({
          ...prev,
          data: result,
          loading: false,
          retrying: false,
          error: null,
          retryCount: 0
        }));
      }
    } catch (error) {
      // Only update state if the request wasn't aborted
      if (!signal.aborted) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout');

        setState(prev => ({
          ...prev,
          loading: false,
          retrying: false,
          error: isNetworkError ? 'Network connection failed. Please check your internet connection.' : errorMessage,
          retryCount: isRetry ? prev.retryCount + 1 : 0
        }));
      }
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [fetchFunction, timeout, cleanup]);

  const retry = useCallback(() => {
    if (state.retryCount < maxRetries && !state.loading && !state.retrying) {
      const delay = retryDelay * Math.pow(2, state.retryCount); // Exponential backoff

      retryTimeoutRef.current = setTimeout(() => {
        loadContent(true);
      }, delay);
    }
  }, [state.retryCount, state.loading, state.retrying, maxRetries, retryDelay, loadContent]);

  const reset = useCallback(() => {
    cleanup();
    setState({
      data: null,
      loading: true,
      error: null,
      retrying: false,
      retryCount: 0
    });
  }, [cleanup]);

  useEffect(() => {
    loadContent();
    return cleanup;
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    ...state,
    retry,
    reset
  };
}

// Specialized hooks for common content types
export function useAartiLoader(aartiId: string, includeDeity = false) {
  return useContentLoader(
    async (signal) => {
      const timestamp = Date.now();
      const response = await fetch(`/api/aartis/${aartiId}${includeDeity ? '?include_deity=true&' : '?'}_t=${timestamp}`, { signal });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Aarti not found');
        }
        throw new Error(`Failed to load aarti: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.data) {
        throw new Error('Invalid response format');
      }
      return result.data;
    },
    [aartiId, includeDeity],
    { maxRetries: 2, retryDelay: 1500 }
  );
}

export function useDeityLoader(deityId: string, includeAartis = false) {
  return useContentLoader(
    async (signal) => {
      console.log(`[Loader] Fetching deity: ${deityId}`);
      const timestamp = Date.now();
      const response = await fetch(`/api/deities/${deityId}${includeAartis ? '?include_aartis=true&' : '?'}_t=${timestamp}`, { signal });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Deity not found');
        }
        throw new Error(`Failed to load deity: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.data) {
        throw new Error('Invalid response format');
      }
      return result.data;
    },
    [deityId, includeAartis],
    { maxRetries: 2, retryDelay: 1500 }
  );
}

export function useAartisLoader(deityId?: string) {
  return useContentLoader(
    async (signal) => {
      const timestamp = Date.now();
      const url = deityId
        ? `/api/aartis?deity_id=${deityId}&_t=${timestamp}`
        : `/api/aartis?_t=${timestamp}`;
      const response = await fetch(url, { signal });
      if (!response.ok) {
        if (response.status === 404 && deityId) {
          throw new Error('Deity not found');
        }
        throw new Error(`Failed to load aartis: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data || [];
    },
    [deityId],
    { maxRetries: 2, retryDelay: 1500 }
  );
}