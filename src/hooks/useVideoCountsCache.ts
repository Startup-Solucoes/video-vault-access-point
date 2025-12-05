import { useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const VIDEO_COUNTS_KEY = 'video-counts-by-client';

export const useVideoCountsCache = () => {
  const queryClient = useQueryClient();

  // Query otimizada usando RPC que faz agregação no banco
  const { data, isLoading, refetch } = useQuery({
    queryKey: [VIDEO_COUNTS_KEY],
    queryFn: async () => {
      console.log('📊 useVideoCountsCache - Buscando contagem via RPC...');
      
      const { data: counts, error } = await supabase
        .rpc('get_video_counts_by_client');

      if (error) {
        console.error('❌ Erro ao buscar contagem de vídeos:', error);
        throw error;
      }

      // Converter array para objeto { client_id: video_count }
      const countsMap: Record<string, number> = {};
      counts?.forEach((row: { client_id: string; video_count: number }) => {
        countsMap[row.client_id] = row.video_count;
      });

      console.log('✅ useVideoCountsCache - Contagem:', Object.keys(countsMap).length, 'clientes');
      
      return countsMap;
    },
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  });

  const videoCountsByClient = useMemo(() => data || {}, [data]);

  const invalidateVideoCountsCache = useCallback(() => {
    console.log('🔄 Invalidando cache de contagem de vídeos...');
    queryClient.invalidateQueries({ queryKey: [VIDEO_COUNTS_KEY] });
  }, [queryClient]);

  // Listener Realtime
  useEffect(() => {
    const channel = supabase
      .channel('video-counts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'video_permissions' },
        () => invalidateVideoCountsCache()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [invalidateVideoCountsCache]);

  const getClientVideoCount = useCallback((clientId: string): number => {
    return videoCountsByClient[clientId] || 0;
  }, [videoCountsByClient]);

  return {
    videoCountsByClient,
    isLoading,
    refetch,
    invalidateVideoCountsCache,
    getClientVideoCount
  };
};
