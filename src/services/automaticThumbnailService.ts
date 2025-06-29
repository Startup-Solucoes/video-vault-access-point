
import { supabase } from '@/integrations/supabase/client';

// Cores padrão para diferentes plataformas
const PLATFORM_COLORS = {
  'youtube': '#FF0000',
  'vimeo': '#1AB7EA',
  'screenpal': '#4CAF50',
  'other': '#6366F1'
} as const;

// URLs das logos das plataformas (usando ícones simples)
const PLATFORM_LOGOS = {
  'youtube': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNiAxOEw0MiAzMkwyNiA0NlYxOFoiIGZpbGw9IiNGRjAwMDAiLz4KPC9zdmc+',
  'vimeo': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE2IiBzdHJva2U9IiMxQUI3RUEiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4=',
  'screenpal': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjE2IiB5PSIyMCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjI0IiByeD0iNCIgc3Ryb2tlPSIjNENBRjUwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjgiIGN5PSIzMiIgcj0iMyIgZmlsbD0iIzRDQUY1MCIvPgo8L3N2Zz4=',
  'other': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjE4IiB5PSIyMiIgd2lkdGg9IjI4IiBoZWlnaHQ9IjIwIiByeD0iNCIgc3Ryb2tlPSIjNjM2NkYxIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iNCIgZmlsbD0iIzYzNjZGMSIvPgo8L3N2Zz4='
};

export const generateThumbnailCanvas = (platform: string): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Não foi possível criar contexto do canvas');
  }

  // Configurar tamanho do canvas (16:9 aspect ratio)
  canvas.width = 320;
  canvas.height = 180;

  // Obter cor da plataforma
  const platformKey = platform.toLowerCase() as keyof typeof PLATFORM_COLORS;
  const backgroundColor = PLATFORM_COLORS[platformKey] || PLATFORM_COLORS.other;

  // Preencher fundo com cor da plataforma
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Adicionar logo da plataforma no centro
  const logoDataUrl = PLATFORM_LOGOS[platformKey] || PLATFORM_LOGOS.other;
  const img = new Image();
  
  return new Promise<string>((resolve) => {
    img.onload = () => {
      // Calcular posição central
      const logoSize = 64;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;
      
      // Desenhar logo
      ctx.drawImage(img, x, y, logoSize, logoSize);
      
      // Converter canvas para data URL
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = logoDataUrl;
  }) as any;
};

export const generateAndSaveThumbnail = async (videoId: string, platform: string): Promise<string | null> => {
  try {
    console.log(`🎨 Gerando thumbnail automática para vídeo ${videoId} (plataforma: ${platform})`);
    
    const thumbnailDataUrl = await generateThumbnailCanvas(platform);
    
    // Converter data URL para blob
    const response = await fetch(thumbnailDataUrl);
    const blob = await response.blob();
    
    // Upload para o Supabase Storage
    const fileName = `${videoId}_thumbnail.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('video-thumbnails')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Erro no upload da thumbnail:', uploadError);
      return null;
    }

    // Obter URL pública da thumbnail
    const { data: urlData } = supabase.storage
      .from('video-thumbnails')
      .getPublicUrl(fileName);

    console.log(`✅ Thumbnail gerada com sucesso: ${urlData.publicUrl}`);
    return urlData.publicUrl;
    
  } catch (error) {
    console.error('💥 Erro ao gerar thumbnail automática:', error);
    return null;
  }
};

export const updateVideoThumbnail = async (videoId: string, thumbnailUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('videos')
      .update({ thumbnail_url: thumbnailUrl })
      .eq('id', videoId);

    if (error) {
      console.error('❌ Erro ao atualizar thumbnail do vídeo:', error);
      return false;
    }

    console.log(`✅ Thumbnail atualizada no banco para vídeo ${videoId}`);
    return true;
  } catch (error) {
    console.error('💥 Erro ao atualizar thumbnail no banco:', error);
    return false;
  }
};

export const generateThumbnailForAllVideos = async (): Promise<{ success: number; failed: number; total: number }> => {
  try {
    console.log('🚀 Iniciando geração de thumbnails para todos os vídeos...');
    
    // Buscar todos os vídeos
    const { data: videos, error: fetchError } = await supabase
      .from('videos')
      .select('id, platform, thumbnail_url');

    if (fetchError) {
      console.error('❌ Erro ao buscar vídeos:', fetchError);
      throw fetchError;
    }

    if (!videos || videos.length === 0) {
      console.log('ℹ️ Nenhum vídeo encontrado');
      return { success: 0, failed: 0, total: 0 };
    }

    console.log(`📋 Encontrados ${videos.length} vídeos`);

    let successCount = 0;
    let failedCount = 0;

    // Processar cada vídeo
    for (const video of videos) {
      try {
        const thumbnailUrl = await generateAndSaveThumbnail(video.id, video.platform || 'other');
        
        if (thumbnailUrl) {
          const updated = await updateVideoThumbnail(video.id, thumbnailUrl);
          if (updated) {
            successCount++;
          } else {
            failedCount++;
          }
        } else {
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
    console.error('💥 Erro no serviço de geração automática de thumbnails:', error);
    throw error;
  }
};
