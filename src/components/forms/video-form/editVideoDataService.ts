
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const loadVideoData = async (videoId: string) => {
  try {
    // Buscar dados do vídeo
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError) throw videoError;

    // Buscar clientes com permissão
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('video_permissions')
      .select('client_id')
      .eq('video_id', videoId);

    if (permissionsError) throw permissionsError;

    const clientIds = permissionsData?.map(p => p.client_id) || [];
    const categories = videoData.category ? videoData.category.split(', ') : [];

    return {
      title: videoData.title,
      description: videoData.description || '',
      video_url: videoData.video_url,
      thumbnail_url: videoData.thumbnail_url || '',
      selectedCategories: categories,
      selectedClients: clientIds,
      publishDateTime: videoData.created_at ? new Date(videoData.created_at) : new Date(),
      platform: videoData.platform || 'outros'
    };
  } catch (error) {
    console.error('Erro ao carregar dados do vídeo:', error);
    toast({
      title: "Erro",
      description: "Erro ao carregar dados do vídeo",
      variant: "destructive"
    });
    throw error;
  }
};
