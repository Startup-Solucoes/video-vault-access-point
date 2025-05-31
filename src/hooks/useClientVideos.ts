
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
  created_at: string;
  permission_created_at: string;
}

export const useClientVideos = (clientId: string) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<ClientVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClientVideos = async () => {
    if (!user || !clientId) {
      setIsLoading(false);
      return;
    }

    console.log('🎬 Buscando vídeos do cliente:', clientId);

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
        created_at: permission.videos.created_at,
        permission_created_at: permission.created_at
      })) || [];

      console.log('✅ Vídeos processados:', clientVideos.length);
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

  // Função para forçar atualização manual
  const refreshClientVideos = () => {
    fetchClientVideos();
  };

  return {
    videos,
    isLoading,
    refreshClientVideos
  };
};
