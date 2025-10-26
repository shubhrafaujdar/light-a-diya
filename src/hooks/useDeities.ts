'use client';

import { useState, useEffect, useCallback } from 'react';
import { Deity } from '@/types';
import type { ApiResponse } from '@/utils/api-helpers';

interface UseDeitiesResult {
  deities: Deity[];
  loading: boolean;
  error: string | null;
  setupRequired: boolean;
  refetch: () => void;
}

export const useDeities = (searchQuery: string = ''): UseDeitiesResult => {
  const [deities, setDeities] = useState<Deity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);

  const fetchDeities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSetupRequired(false);

      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/deities?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch deities: ${response.status}`);
      }

      const data: ApiResponse<Deity[]> = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setDeities(data.data || []);
      // Check if setup is required (optional field - only present when database setup is needed)
      setSetupRequired(data.setupRequired ?? false);
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
    setupRequired,
    refetch,
  };
};