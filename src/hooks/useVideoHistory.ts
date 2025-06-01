
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCache } from '@/hooks/useCache';

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
  const { get, set, invalidatePattern } = useCache<Video[]>({
    defaultTTL: 3 * 60 * 1000, // 3 minutos para histórico
    maxSize: 20
  });
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = async (forceRefresh = false) => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const cacheKey = `video_history_${user.id}_${limit}`;
    
    // Tentar buscar do cache primeiro, a menos que seja refresh forçado
    if (!forceRefresh) {
      const cachedData = get(cacheKey);
      if (cachedData) {
        console.log('🎯 Usando histórico de vídeos do cache');
        setVideos(cachedData);
        setIsLoading(false);
        return;
      }
    }

    console.log('🎬 Buscando histórico de vídeos do banco...');
    console.log('Usuário:', user.id);
    console.log('Limite:', limit);
    setIsLoading(true);

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
      
      const videoData = data || [];
      
      // Armazenar no cache
      set(cacheKey, videoData);
      setVideos(videoData);
    } catch (error) {
      console.error('💥 Erro no useVideoHistory:', error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [user, limit]);

  // Função para forçar atualização manual
  const refreshVideos = () => {
    if (user) {
      invalidatePattern(`video_history_${user.id}`);
    }
    fetchVideos(true);
  };

  return {
    videos,
    isLoading,
    refreshVideos
  };
};
