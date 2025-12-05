import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const VIDEO_COUNTS_KEY = 'video-counts-by-client';

export const useVideoCountsCache = () => {
  const queryClient = useQueryClient();

  // Query para buscar contagem de vídeos
  const { data: videoCountsByClient = {}, isLoading, refetch } = useQuery({
    queryKey: [VIDEO_COUNTS_KEY],
    queryFn: async () => {
      console.log('📊 useVideoCountsCache - Buscando contagem de vídeos...');
      
      const { data, error } = await supabase
        .from('video_permissions')
        .select('client_id, video_id');

      if (error) {
        console.error('❌ Erro ao buscar contagem de vídeos:', error);
        throw error;
      }

      // Contar vídeos únicos por cliente
      const counts: Record<string, number> = {};
      data?.forEach(permission => {
        counts[permission.client_id] = (counts[permission.client_id] || 0) + 1;
      });

      console.log('✅ useVideoCountsCache - Contagem atualizada:', Object.keys(counts).length, 'clientes');
      return counts;
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

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
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'video_permissions'
        },
        (payload) => {
          console.log('📡 Mudança detectada em video_permissions:', payload.eventType);
          // Invalidar cache quando houver mudanças
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

  // Função auxiliar para obter contagem de um cliente específico
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
