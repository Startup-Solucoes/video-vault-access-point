import { useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const VIDEO_COUNTS_KEY = 'video-counts-by-client';

export const useVideoCountsCache = () => {
  const queryClient = useQueryClient();

  // Query para buscar contagem de vídeos
  const { data, isLoading, refetch } = useQuery({
    queryKey: [VIDEO_COUNTS_KEY],
    queryFn: async () => {
      console.log('📊 useVideoCountsCache - Buscando contagem de vídeos...');
      
      // Buscar TODAS as permissões (Supabase limita a 1000 por padrão)
      // Usar range para buscar em lotes
      const allPermissions: { client_id: string }[] = [];
      let from = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: batch, error: batchError } = await supabase
          .from('video_permissions')
          .select('client_id')
          .range(from, from + batchSize - 1);

        if (batchError) {
          console.error('❌ Erro ao buscar permissões:', batchError);
          throw batchError;
        }

        if (batch && batch.length > 0) {
          allPermissions.push(...batch);
          from += batchSize;
          hasMore = batch.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      const permissions = allPermissions;

      console.log('📊 useVideoCountsCache - Permissões encontradas:', permissions?.length);

      // Contar vídeos por cliente
      const counts: Record<string, number> = {};
      permissions?.forEach(permission => {
        if (permission.client_id) {
          counts[permission.client_id] = (counts[permission.client_id] || 0) + 1;
        }
      });

      console.log('✅ useVideoCountsCache - Contagem atualizada:', Object.keys(counts).length, 'clientes');
      console.log('📊 useVideoCountsCache - Sample counts:', 
        Object.entries(counts).slice(0, 3).map(([id, count]) => `${id.substring(0, 8)}...: ${count}`)
      );
      
      return counts;
    },
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  });

  // Memoize the video counts object
  const videoCountsByClient = useMemo(() => {
    console.log('📊 videoCountsByClient memo - data:', data ? Object.keys(data).length : 0, 'clientes');
    return data || {};
  }, [data]);

  // Função para invalidar o cache manualmente
  const invalidateVideoCountsCache = useCallback(() => {
    console.log('🔄 Invalidando cache de contagem de vídeos...');
    queryClient.invalidateQueries({ queryKey: [VIDEO_COUNTS_KEY] });
  }, [queryClient]);

  // Configurar listener de Realtime para mudanças em video_permissions
  useEffect(() => {
    console.log('🔌 Configurando listener realtime para video_permissions...');
    
    const channel = supabase
      .channel('video-counts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_permissions'
        },
        (payload) => {
          console.log('📡 Mudança detectada em video_permissions:', payload.eventType);
          invalidateVideoCountsCache();
        }
      )
      .subscribe((status) => {
        console.log('📡 Status do canal realtime:', status);
      });

    return () => {
      console.log('🔌 Removendo listener realtime de video_permissions...');
      supabase.removeChannel(channel);
    };
  }, [invalidateVideoCountsCache]);

  // Função auxiliar para obter contagem - usando useMemo para estabilizar
  const getClientVideoCount = useCallback((clientId: string): number => {
    const count = videoCountsByClient[clientId] || 0;
    return count;
  }, [videoCountsByClient]);

  return {
    videoCountsByClient,
    isLoading,
    refetch,
    invalidateVideoCountsCache,
    getClientVideoCount
  };
};
