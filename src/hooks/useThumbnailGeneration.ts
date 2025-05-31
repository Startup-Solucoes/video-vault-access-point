
import { useState } from 'react';
import { generateMissingThumbnails, generateThumbnailForVideo } from '@/services/thumbnailGenerationService';
import { toast } from '@/hooks/use-toast';

interface ThumbnailGenerationResult {
  success: number;
  failed: number;
  total: number;
}

export const useThumbnailGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<ThumbnailGenerationResult | null>(null);

  const generateAllThumbnails = async (): Promise<ThumbnailGenerationResult | null> => {
    if (isGenerating) {
      toast({
        title: "Processo em andamento",
        description: "Aguarde o processo atual terminar",
        variant: "destructive"
      });
      return null;
    }

    setIsGenerating(true);
    
    try {
      console.log('🚀 Iniciando geração em massa de thumbnails...');
      
      const result = await generateMissingThumbnails();
      setLastResult(result);
      
      if (result.total === 0) {
        toast({
          title: "Nenhum vídeo encontrado",
          description: "Todos os vídeos já possuem thumbnails ou não há vídeos cadastrados",
        });
      } else if (result.success === result.total) {
        toast({
          title: "Sucesso!",
          description: `Todas as ${result.success} thumbnails foram geradas com sucesso`,
        });
      } else if (result.success > 0) {
        toast({
          title: "Parcialmente concluído",
          description: `${result.success} thumbnails geradas, ${result.failed} falharam`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: `Não foi possível gerar nenhuma thumbnail (${result.failed} falhas)`,
          variant: "destructive"
        });
      }
      
      return result;
      
    } catch (error) {
      console.error('💥 Erro na geração de thumbnails:', error);
      
      toast({
        title: "Erro",
        description: `Erro ao gerar thumbnails: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSingleThumbnail = async (videoId: string): Promise<boolean> => {
    if (isGenerating) {
      toast({
        title: "Processo em andamento",
        description: "Aguarde o processo atual terminar",
        variant: "destructive"
      });
      return false;
    }

    setIsGenerating(true);
    
    try {
      console.log('🚀 Gerando thumbnail individual...');
      
      const success = await generateThumbnailForVideo(videoId);
      
      if (success) {
        toast({
          title: "Sucesso!",
          description: "Thumbnail gerada com sucesso",
        });
      } else {
        toast({
          title: "Aviso",
          description: "Não foi possível gerar thumbnail para este vídeo",
          variant: "destructive"
        });
      }
      
      return success;
      
    } catch (error) {
      console.error('💥 Erro na geração de thumbnail individual:', error);
      
      toast({
        title: "Erro",
        description: `Erro ao gerar thumbnail: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    lastResult,
    generateAllThumbnails,
    generateSingleThumbnail
  };
};
