
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCache } from '@/hooks/useCache';

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
  const { get, set, invalidatePattern } = useCache<ClientVideo[]>({
    defaultTTL: 2 * 60 * 1000,
    maxSize: 30
  });
  
  const [videos, setVideos] = useState<ClientVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClientVideos = async (forceRefresh = false) => {
    if (!user || !clientId) {
      setIsLoading(false);
      return;
    }

    const cacheKey = `client_videos_${clientId}`;
    
    if (!forceRefresh) {
      const cachedData = get(cacheKey);
      if (cachedData) {
        console.log(`🎯 Cache hit: vídeos do cliente ${clientId}`);
        setVideos(cachedData);
        setIsLoading(false);
        return;
      }
    }

    console.log('🎬 Buscando vídeos do cliente (OTIMIZADO):', clientId);
    setIsLoading(true);

    try {
      // Query otimizada com select específico
      const { data, error } = await supabase
        .from('video_permissions')
        .select(`
          created_at,
          videos!inner (
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
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(50); // Limite para performance

      if (error) {
        console.error('❌ Erro ao buscar vídeos do cliente:', error);
        throw error;
      }

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

      console.log('✅ Vídeos otimizados processados:', clientVideos.length);
      
      set(cacheKey, clientVideos);
      setVideos(clientVideos);
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

  const refreshClientVideos = () => {
    invalidatePattern(`client_videos_${clientId}`);
    fetchClientVideos(true);
  };

  return {
    videos,
    isLoading,
    refreshClientVideos
  };
};
