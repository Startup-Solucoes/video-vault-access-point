
import { supabase } from '@/integrations/supabase/client';
import { getVideoThumbnail } from '@/utils/videoThumbnails';

interface Video {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
}

export const generateMissingThumbnails = async (): Promise<{ success: number; failed: number; total: number }> => {
  console.log('🖼️ Iniciando geração de thumbnails para vídeos sem thumbnail...');
  
  try {
    // Buscar todos os vídeos que não possuem thumbnail
    const { data: videos, error: fetchError } = await supabase
      .from('videos')
      .select('id, title, video_url, thumbnail_url')
      .is('thumbnail_url', null);

    if (fetchError) {
      console.error('❌ Erro ao buscar vídeos:', fetchError);
      throw fetchError;
    }

    if (!videos || videos.length === 0) {
      console.log('ℹ️ Nenhum vídeo sem thumbnail encontrado');
      return { success: 0, failed: 0, total: 0 };
    }

    console.log(`📋 Encontrados ${videos.length} vídeos sem thumbnail`);

    let successCount = 0;
    let failedCount = 0;

    // Processar cada vídeo
    for (const video of videos) {
      try {
        console.log(`🔄 Processando vídeo: ${video.title}`);
        
        // Tentar extrair thumbnail usando a função existente
        const thumbnailUrl = getVideoThumbnail(video.video_url);
        
        if (thumbnailUrl) {
          // Atualizar o vídeo com a nova thumbnail
          const { error: updateError } = await supabase
            .from('videos')
            .update({ thumbnail_url: thumbnailUrl })
            .eq('id', video.id);

          if (updateError) {
            console.error(`❌ Erro ao atualizar thumbnail do vídeo ${video.id}:`, updateError);
            failedCount++;
          } else {
            console.log(`✅ Thumbnail gerada para: ${video.title}`);
            successCount++;
          }
        } else {
          console.warn(`⚠️ Não foi possível gerar thumbnail para: ${video.title}`);
          failedCount++;
        }
      } catch (error) {
        console.error(`💥 Erro ao processar vídeo ${video.id}:`, error);
        failedCount++;
      }
    }

    console.log(`🎉 Processo concluído: ${successCount} sucessos, ${failedCount} falhas`);
    
    return {
      success: successCount,
      failed: failedCount,
      total: videos.length
    };

  } catch (error) {
    console.error('💥 Erro no serviço de geração de thumbnails:', error);
    throw error;
  }
};

export const generateThumbnailForVideo = async (videoId: string): Promise<boolean> => {
  console.log(`🖼️ Gerando thumbnail para vídeo específico: ${videoId}`);
  
  try {
    // Buscar o vídeo específico
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('id, title, video_url, thumbnail_url')
      .eq('id', videoId)
      .single();

    if (fetchError) {
      console.error('❌ Erro ao buscar vídeo:', fetchError);
      throw fetchError;
    }

    if (!video) {
      console.error('❌ Vídeo não encontrado');
      return false;
    }

    // Tentar extrair thumbnail
    const thumbnailUrl = getVideoThumbnail(video.video_url);
    
    if (!thumbnailUrl) {
      console.warn(`⚠️ Não foi possível gerar thumbnail para: ${video.title}`);
      return false;
    }

    // Atualizar o vídeo com a nova thumbnail
    const { error: updateError } = await supabase
      .from('videos')
      .update({ thumbnail_url: thumbnailUrl })
      .eq('id', videoId);

    if (updateError) {
      console.error(`❌ Erro ao atualizar thumbnail:`, updateError);
      throw updateError;
    }

    console.log(`✅ Thumbnail gerada com sucesso para: ${video.title}`);
    return true;

  } catch (error) {
    console.error('💥 Erro ao gerar thumbnail para vídeo específico:', error);
    throw error;
  }
};
