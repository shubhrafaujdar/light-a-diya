'use client';

import { useState, useEffect, useCallback } from 'react';
import { Deity } from '@/types';

interface UseDeitiesResult {
  deities: Deity[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDeities = (searchQuery: string = ''): UseDeitiesResult => {
  const [deities, setDeities] = useState<Deity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/deities?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch deities: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setDeities(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch deities');
      }
    } catch (err) {
      console.error('Error fetching deities:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setDeities([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchDeities();
  }, [fetchDeities]);

  const refetch = useCallback(() => {
    fetchDeities();
  }, [fetchDeities]);

  return {
    deities,
    loading,
    error,
    refetch,
  };
};