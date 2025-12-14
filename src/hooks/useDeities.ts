import { useQuery } from '@tanstack/react-query';
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
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['deities', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      params.append('_t', Date.now().toString());
      const response = await fetch(`/api/deities?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch deities: ${response.status}`);
      }

      const result: ApiResponse<Deity[]> = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      return {
        deities: result.data || [],
        setupRequired: result.setupRequired ?? false
      };
    },
    staleTime: 60 * 1000, // 1 minute
  });

  return {
    deities: data?.deities || [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    setupRequired: data?.setupRequired || false,
    refetch,
  };
};