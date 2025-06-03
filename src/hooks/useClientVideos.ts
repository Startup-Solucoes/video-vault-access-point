
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCache } from '@/hooks/useCache';

interface ClientVideoData {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  platform?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  created_by: string;
  permission_created_at: string;
  permission_id: string;
  display_order: number;
}

export const useClientVideos = (clientId: string) => {
  const { user } = useAuth();
  const { get, set, invalidatePattern } = useCache<ClientVideoData[]>({
    defaultTTL: 2 * 60 * 1000,
    maxSize: 100
  });
  
  const [videos, setVideos] = useState<ClientVideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClientVideos = async (forceRefresh = false) => {
    if (!clientId) {
      setIsLoading(false);
      return;
    }

    const cacheKey = `client_videos_${clientId}`;
    
    if (!forceRefresh) {
      const cachedData = get(cacheKey);
      if (cachedData) {
        console.log('🎯 Cache hit: vídeos do cliente', clientId);
        setVideos(cachedData);
        setIsLoading(false);
        return;
      }
    }

    console.log('🎬 Buscando vídeos do cliente:', clientId);
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('video_permissions')
        .select(`
          id,
          created_at,
          display_order,
          videos (
            id,
            title,
            description,
            video_url,
            thumbnail_url,
            platform,
            category,
            tags,
            created_at,
            created_by
          )
        `)
        .eq('client_id', clientId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar vídeos do cliente:', error);
        throw error;
      }

      const formattedVideos: ClientVideoData[] = (data || [])
        .filter(permission => permission.videos)
        .map(permission => ({
          id: permission.videos.id,
          title: permission.videos.title,
          description: permission.videos.description,
          video_url: permission.videos.video_url,
          thumbnail_url: permission.videos.thumbnail_url,
          platform: permission.videos.platform,
          category: permission.videos.category,
          tags: permission.videos.tags,
          created_at: permission.videos.created_at,
          created_by: permission.videos.created_by,
          permission_created_at: permission.created_at,
          permission_id: permission.id,
          display_order: permission.display_order || 0
        }));

      console.log('✅ Vídeos do cliente encontrados:', formattedVideos.length);
      
      set(cacheKey, formattedVideos);
      setVideos(formattedVideos);
    } catch (error) {
      console.error('💥 Erro no useClientVideos:', error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientVideos();
  }, [clientId]);

  const refreshVideos = () => {
    if (clientId) {
      invalidatePattern(`client_videos_${clientId}`);
    }
    fetchClientVideos(true);
  };

  return {
    videos,
    isLoading,
    refreshVideos
  };
};

export type { ClientVideoData };
