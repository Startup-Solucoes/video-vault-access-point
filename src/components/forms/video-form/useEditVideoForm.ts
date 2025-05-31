
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { EditVideoFormData } from './EditVideoFormTypes';

export const useEditVideoForm = (videoId: string, onClose: () => void) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<EditVideoFormData>({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    selectedCategories: [],
    selectedClients: [],
    publishDateTime: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Carregar dados do vídeo
  useEffect(() => {
    const loadVideoData = async () => {
      if (!videoId) return;

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

        setFormData({
          title: videoData.title,
          description: videoData.description || '',
          video_url: videoData.video_url,
          thumbnail_url: videoData.thumbnail_url || '',
          selectedCategories: categories,
          selectedClients: clientIds,
          publishDateTime: videoData.created_at ? new Date(videoData.created_at) : new Date()
        });
      } catch (error) {
        console.error('Erro ao carregar dados do vídeo:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados do vídeo",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadVideoData();
  }, [videoId]);

  const handleFieldChange = (field: keyof EditVideoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter(c => c !== category)
    }));
  };

  const handleClientChange = (clientIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedClients: clientIds
    }));
  };

  const handleDateTimeChange = (publishDateTime: Date) => {
    setFormData(prev => ({
      ...prev,
      publishDateTime
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para editar vídeos",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (!formData.video_url.trim()) {
      toast({
        title: "Erro",
        description: "A URL do vídeo é obrigatória",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Atualizar dados do vídeo
      const videoData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        video_url: formData.video_url.trim(),
        thumbnail_url: formData.thumbnail_url.trim() || null,
        category: formData.selectedCategories.join(', ') || null,
        tags: formData.selectedCategories.length > 0 ? formData.selectedCategories : null,
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

      // Criar novas permissões
      if (formData.selectedClients.length > 0) {
        const permissions = formData.selectedClients.map(clientId => ({
          video_id: videoId,
          client_id: clientId,
          granted_by: user.id
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
      
      onClose();
      
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      toast({
        title: "Erro",
        description: `Erro ao atualizar vídeo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isLoadingData,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handleSubmit
  };
};
