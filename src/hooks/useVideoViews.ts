
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VideoView {
  id: string;
  video_id: string;
  user_id: string;
  viewed_at: string;
  watch_duration: number;
  is_valid_view: boolean;
  video_title?: string;
  user_email?: string;
}

export const useVideoViews = () => {
  return useQuery({
    queryKey: ['video-views'],
    queryFn: async (): Promise<VideoView[]> => {
      console.log('🔍 Buscando visualizações de vídeos...');

      const { data, error } = await supabase
        .from('video_views')
        .select(`
          id,
          video_id,
          user_id,
          viewed_at,
          watch_duration,
          is_valid_view,
          videos!inner(title),
          profiles!inner(email)
        `)
        .eq('is_valid_view', true)
        .gte('watch_duration', 20)
        .order('viewed_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar visualizações:', error);
        throw error;
      }

      console.log('✅ Visualizações carregadas:', data?.length || 0);

      return (data || []).map(view => ({
        id: view.id,
        video_id: view.video_id,
        user_id: view.user_id,
        viewed_at: view.viewed_at,
        watch_duration: view.watch_duration,
        is_valid_view: view.is_valid_view,
        video_title: (view.videos as any)?.title,
        user_email: (view.profiles as any)?.email
      }));
    },
  });
};

export const useVideoViewStats = () => {
  return useQuery({
    queryKey: ['video-view-stats'],
    queryFn: async () => {
      console.log('📊 Buscando estatísticas de visualizações...');

      // Buscar estatísticas gerais
      const { data: stats, error: statsError } = await supabase
        .from('video_views')
        .select('id, is_valid_view, video_id')
        .eq('is_valid_view', true)
        .gte('watch_duration', 20);

      if (statsError) {
        console.error('Erro ao buscar estatísticas:', statsError);
        throw statsError;
      }

      // Buscar vídeos mais assistidos
      const { data: topVideos, error: topError } = await supabase
        .from('videos')
        .select('id, title, view_count')
        .order('view_count', { ascending: false })
        .limit(5);

      if (topError) {
        console.error('Erro ao buscar vídeos mais assistidos:', topError);
        throw topError;
      }

      console.log('✅ Estatísticas carregadas');

      return {
        totalValidViews: stats?.length || 0,
        uniqueVideosWatched: new Set(stats?.map(s => s.video_id)).size,
        topVideos: topVideos || []
      };
    },
  });
};
