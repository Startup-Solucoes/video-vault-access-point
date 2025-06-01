
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ClientVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string | null;
  platform: string | null;
  created_at: string;
  permission_created_at: string;
}

export const useClientVideos = (clientId: string) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<ClientVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchClientVideos = async (forceRefresh = false) => {
    if (!user || !clientId) {
      setIsLoading(false);
      return;
    }

    // Implementa cache simples - só busca se passou mais de 2 minutos ou force refresh
    const now = Date.now();
    const CACHE_TIME = 2 * 60 * 1000; // 2 minutos
    
    if (!forceRefresh && lastFetch && (now - lastFetch) < CACHE_TIME) {
      console.log('🎬 Usando cache de vídeos do cliente:', clientId);
      setIsLoading(false);
      return;
    }

    console.log('🎬 Buscando vídeos do cliente:', clientId);
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('video_permissions')
        .select(`
          created_at,
          videos (
            id,
            title,
            description,
            video_url,
            thumbnail_url,
            category,
            platform,
            created_at
          )
        `)
        .eq('client_id', clientId);

      if (error) {
        console.error('❌ Erro ao buscar vídeos do cliente:', error);
        throw error;
      }

      console.log('✅ Permissões encontradas:', data?.length || 0);
      
      const clientVideos = data?.map(permission => ({
        id: permission.videos.id,
        title: permission.videos.title,
        description: permission.videos.description,
        video_url: permission.videos.video_url,
        thumbnail_url: permission.videos.thumbnail_url,
        category: permission.videos.category,
        platform: permission.videos.platform,
        created_at: permission.videos.created_at,
        permission_created_at: permission.created_at
      })) || [];

      console.log('✅ Vídeos processados:', clientVideos.length);
      setVideos(clientVideos);
      setLastFetch(now);
    } catch (error) {
      console.error('💥 Erro no useClientVideos:', error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientVideos();
  }, [user, clientId]);

  // Função para forçar atualização manual
  const refreshClientVideos = () => {
    fetchClientVideos(true);
  };

  return {
    videos,
    isLoading,
    refreshClientVideos
  };
};
