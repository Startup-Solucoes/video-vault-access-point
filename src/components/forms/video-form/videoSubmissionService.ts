
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { VideoFormData } from './VideoFormTypes';
import { sendVideoNotifications } from '@/services/emailNotificationService';

export const submitVideoData = async (formData: VideoFormData, user: any): Promise<boolean> => {
  console.log('📋 === INICIANDO CADASTRO DE VÍDEO ===');
  console.log('📄 Dados do formulário:', {
    title: formData.title,
    clientsCount: formData.selectedClients.length,
    categoriesCount: formData.selectedCategories.length,
    userId: user.id
  });
  
  const videoData = {
    title: formData.title.trim(),
    description: formData.description.trim() || null,
    video_url: formData.video_url.trim(),
    thumbnail_url: formData.thumbnail_url.trim() || null,
    category: formData.selectedCategories.join(', ') || null,
    tags: formData.selectedCategories.length > 0 ? formData.selectedCategories : null,
    platform: formData.platform,
    created_by: user.id
  };

  try {
    // Inserir o vídeo
    console.log('💾 Inserindo vídeo na tabela videos...');
    const { data: insertedVideo, error: videoError } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();

    if (videoError) {
      console.error('❌ ERRO ao inserir vídeo:', videoError);
      throw videoError;
    }

    console.log('✅ Vídeo inserido com sucesso:', insertedVideo.id);

    // Criar as permissões para os clientes selecionados
    if (formData.selectedClients.length > 0 && insertedVideo) {
      console.log('🔑 Criando permissões para clientes...');
      console.log('Lista de clientes selecionados:', formData.selectedClients);
      
      // Obter próximo display_order para cada cliente
      const clientOrderPromises = formData.selectedClients.map(async (clientId) => {
        const { data: lastOrder } = await supabase
          .from('video_permissions')
          .select('display_order')
          .eq('client_id', clientId)
          .order('display_order', { ascending: false })
          .limit(1);
        
        return {
          clientId,
          nextOrder: (lastOrder?.[0]?.display_order || 0) + 1
        };
      });

      const clientOrders = await Promise.all(clientOrderPromises);
      const orderMap = Object.fromEntries(
        clientOrders.map(co => [co.clientId, co.nextOrder])
      );

      const permissions = formData.selectedClients.map(clientId => ({
        video_id: insertedVideo.id,
        client_id: clientId,
        granted_by: user.id,
        display_order: orderMap[clientId]
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

      console.log('✅ Permissões inseridas com sucesso');

      // Enviar notificações por email APENAS se há clientes selecionados
      console.log('📧 === INICIANDO ENVIO DE NOTIFICAÇÕES ===');
      
      try {
        const notificationSuccess = await sendVideoNotifications({
          videoTitle: formData.title,
          videoDescription: formData.description,
          categories: formData.selectedCategories,
          clientIds: formData.selectedClients,
          adminId: user.id
        });

        if (notificationSuccess) {
          console.log('✅ Notificações enviadas com sucesso');
        } else {
          console.warn('⚠️ Algumas notificações falharam, mas o vídeo foi cadastrado');
        }
      } catch (emailError) {
        console.error('❌ Erro ao enviar notificações:', emailError);
        // Não falha o processo principal se o email falhar
      }
    } else {
      console.log('ℹ️ Nenhum cliente selecionado, pulando criação de permissões e notificações');
    }

    console.log('🎉 === VÍDEO CADASTRADO COM SUCESSO ===');
    
    toast({
      title: "Sucesso!",
      description: `Vídeo cadastrado com sucesso${formData.selectedClients.length > 0 ? ' e notificações enviadas' : ''}`,
    });
    
    return true;
    
  } catch (error) {
    console.error('💥 === ERRO NO PROCESSO DE CADASTRO ===');
    console.error('Erro completo:', error);
    
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
