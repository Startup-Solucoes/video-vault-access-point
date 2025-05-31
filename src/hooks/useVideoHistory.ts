
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string | null;
  created_at: string;
  created_by: string;
}

export const useVideoHistory = (limit: number = 10) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      console.log('🎬 Buscando histórico de vídeos...');
      console.log('Usuário:', user.id);
      console.log('Limite:', limit);

      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('❌ Erro ao buscar vídeos:', error);
          throw error;
        }

        console.log('✅ Vídeos encontrados:', data?.length || 0);
        console.log('Dados dos vídeos:', data);
        
        setVideos(data || []);
      } catch (error) {
        console.error('💥 Erro no useVideoHistory:', error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [user, limit]);

  return {
    videos,
    isLoading
  };
};
