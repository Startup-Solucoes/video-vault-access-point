
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientVideoActionsProps {
  clientId: string;
  selectedVideos: string[];
  onRefreshVideos: () => void;
  onClearSelection: () => void;
}

export const useClientVideoActions = ({ 
  clientId, 
  selectedVideos, 
  onRefreshVideos, 
  onClearSelection 
}: ClientVideoActionsProps) => {
  const { toast } = useToast();

  const handleBulkDelete = async () => {
    if (selectedVideos.length === 0) return;
    
    console.log('🗑️ Iniciando exclusão em lote:', { selectedVideos, clientId });

    try {
      const { error } = await supabase
        .from('video_permissions')
        .delete()
        .eq('client_id', clientId)
        .in('video_id', selectedVideos);

      if (error) {
        console.error('❌ Erro ao deletar permissões:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover vídeos do cliente",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Permissões deletadas com sucesso');
      
      toast({
        title: "Sucesso",
        description: `${selectedVideos.length} vídeo(s) removido(s) do cliente com sucesso`,
      });

      onClearSelection();
      onRefreshVideos();
      
    } catch (error) {
      console.error('💥 Erro inesperado ao deletar vídeos:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao remover vídeos",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVideo = async (videoId: string, videoTitle: string) => {
    console.log('🗑️ Iniciando exclusão do vídeo:', { videoId, videoTitle, clientId });

    try {
      const { data: permission, error: permissionError } = await supabase
        .from('video_permissions')
        .select('id')
        .eq('video_id', videoId)
        .eq('client_id', clientId)
        .single();

      if (permissionError) {
        console.error('❌ Erro ao buscar permissão:', permissionError);
        toast({
          title: "Erro",
          description: "Erro ao buscar permissão do vídeo",
          variant: "destructive",
        });
        return;
      }

      console.log('🔍 Permissão encontrada:', permission);

      const { error: deleteError } = await supabase
        .from('video_permissions')
        .delete()
        .eq('id', permission.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar permissão:', deleteError);
        toast({
          title: "Erro",
          description: "Erro ao remover vídeo do cliente",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Permissão deletada com sucesso');
      
      toast({
        title: "Sucesso",
        description: `Vídeo "${videoTitle}" removido do cliente com sucesso`,
      });

      onRefreshVideos();
      
    } catch (error) {
      console.error('💥 Erro inesperado ao deletar vídeo:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao remover vídeo",
        variant: "destructive",
      });
    }
  };

  return {
    handleBulkDelete,
    handleDeleteVideo
  };
};
