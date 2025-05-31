
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { VideoFormData } from './VideoFormTypes';

export const submitVideoData = async (formData: VideoFormData, user: any): Promise<boolean> => {
  console.log('📋 Preparando dados para inserção no banco...');
  
  const videoData = {
    title: formData.title.trim(),
    description: formData.description.trim() || null,
    video_url: formData.video_url.trim(),
    thumbnail_url: formData.thumbnail_url.trim() || null,
    category: formData.selectedCategories.join(', ') || null,
    tags: formData.selectedCategories.length > 0 ? formData.selectedCategories : null,
    created_by: user.id
  };

  console.log('📄 Dados preparados para inserção:', videoData);
  console.log('👤 ID do usuário criador:', user.id);

  try {
    // Primeiro, cadastrar o vídeo
    console.log('💾 Inserindo vídeo na tabela videos...');
    const { data: insertedVideo, error: videoError } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();

    if (videoError) {
      console.error('❌ ERRO ao inserir vídeo:', videoError);
      console.error('Código do erro:', videoError.code);
      console.error('Mensagem do erro:', videoError.message);
      console.error('Detalhes do erro:', videoError.details);
      throw videoError;
    }

    console.log('✅ Vídeo inserido com sucesso:', insertedVideo);

    // Em seguida, criar as permissões para os clientes selecionados
    if (formData.selectedClients.length > 0 && insertedVideo) {
      console.log('🔑 Criando permissões para clientes...');
      console.log('Lista de clientes selecionados:', formData.selectedClients);
      
      const permissions = formData.selectedClients.map(clientId => ({
        video_id: insertedVideo.id,
        client_id: clientId,
        granted_by: user.id
      }));

      console.log('📋 Permissões preparadas:', permissions);

      const { data: insertedPermissions, error: permissionError } = await supabase
        .from('video_permissions')
        .insert(permissions)
        .select();

      if (permissionError) {
        console.error('❌ ERRO ao inserir permissões:', permissionError);
        throw permissionError;
      }

      console.log('✅ Permissões inseridas com sucesso:', insertedPermissions);
    } else {
      console.log('ℹ️ Nenhum cliente selecionado, pulando criação de permissões');
    }

    console.log('🎉 === VÍDEO CADASTRADO COM SUCESSO ===');
    
    toast({
      title: "Sucesso!",
      description: "Vídeo cadastrado com sucesso",
    });
    
    return true;
    
  } catch (error) {
    console.error('💥 === ERRO NO PROCESSO DE CADASTRO ===');
    console.error('Erro completo:', error);
    console.error('Tipo do erro:', typeof error);
    console.error('Message:', error instanceof Error ? error.message : 'Erro desconhecido');
    
    // Análise específica para RLS
    if (error instanceof Error && error.message.includes('row-level security')) {
      console.error('🔒 ERRO DE RLS: O usuário não tem permissão para inserir na tabela videos');
      toast({
        title: "Erro de Permissão",
        description: "Você não tem permissão para cadastrar vídeos. Verifique se você está logado como administrador.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Erro",
        description: `Erro ao cadastrar vídeo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
    }
    
    return false;
  }
};
