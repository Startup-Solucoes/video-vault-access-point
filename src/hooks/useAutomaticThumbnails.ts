
import { useState } from 'react';
import { generateThumbnailForAllVideos } from '@/services/automaticThumbnailService';
import { toast } from '@/hooks/use-toast';

interface AutomaticThumbnailResult {
  success: number;
  failed: number;
  total: number;
}

export const useAutomaticThumbnails = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<AutomaticThumbnailResult | null>(null);

  const generateAllAutomaticThumbnails = async (): Promise<AutomaticThumbnailResult | null> => {
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
      console.log('🚀 Iniciando geração automática de thumbnails...');
      
      const result = await generateThumbnailForAllVideos();
      setLastResult(result);
      
      if (result.total === 0) {
        toast({
          title: "Nenhum vídeo encontrado",
          description: "Não há vídeos cadastrados no sistema",
        });
      } else if (result.success === result.total) {
        toast({
          title: "Sucesso!",
          description: `Todas as ${result.success} thumbnails foram geradas automaticamente`,
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
      console.error('💥 Erro na geração automática de thumbnails:', error);
      
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

  return {
    isGenerating,
    lastResult,
    generateAllAutomaticThumbnails
  };
};
