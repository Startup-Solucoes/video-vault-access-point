
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { EditVideoFormData } from './EditVideoFormTypes';

export const submitEditVideoData = async (formData: EditVideoFormData, videoId: string, user: any): Promise<boolean> => {
  try {
    // Buscar as permissões existentes para preservar o display_order
    const { data: existingPermissions, error: fetchError } = await supabase
      .from('video_permissions')
      .select('client_id, display_order')
      .eq('video_id', videoId);

    if (fetchError) throw fetchError;

    // Criar um mapa para preservar o display_order por cliente
    const displayOrderMap = new Map();
    existingPermissions?.forEach(permission => {
      displayOrderMap.set(permission.client_id, permission.display_order);
    });

    // Atualizar dados do vídeo
    const videoData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      video_url: formData.video_url.trim(),
      thumbnail_url: formData.thumbnail_url.trim() || null,
      category: formData.selectedCategories.join(', ') || null,
      tags: formData.selectedCategories.length > 0 ? formData.selectedCategories : null,
      platform: formData.platform,
      publish_date: formData.publishDateTime.toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: videoError } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', videoId);

    if (videoError) throw videoError;

    // Remover todas as permissões existentes
    const { error: deleteError } = await supabase
      .from('video_permissions')
      .delete()
      .eq('video_id', videoId);

    if (deleteError) throw deleteError;

    // Criar novas permissões preservando o display_order
    if (formData.selectedClients.length > 0) {
      const permissions = formData.selectedClients.map(clientId => ({
        video_id: videoId,
        client_id: clientId,
        granted_by: user.id,
        display_order: displayOrderMap.get(clientId) || 0 // Preserva o display_order original ou usa 0 para novos clientes
      }));

      const { error: permissionError } = await supabase
        .from('video_permissions')
        .insert(permissions);

      if (permissionError) throw permissionError;
    }

    toast({
      title: "Sucesso!",
      description: "Vídeo atualizado com sucesso",
    });
    
    return true;
    
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    toast({
      title: "Erro",
      description: `Erro ao atualizar vídeo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      variant: "destructive"
    });
    return false;
  }
};
