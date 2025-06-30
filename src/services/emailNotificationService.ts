import { supabase } from '@/integrations/supabase/client';

interface VideoNotificationData {
  videoTitle: string;
  videoDescription?: string;
  categories: string[];
  clientIds: string[];
  adminId: string;
}

interface ClientConfirmationData {
  clientName: string;
  clientEmail: string;
}

export const sendVideoNotifications = async (data: VideoNotificationData): Promise<boolean> => {
  try {
    console.log('📧 === INICIANDO ENVIO DE NOTIFICAÇÕES ===');
    console.log('📋 Dados da notificação:', {
      videoTitle: data.videoTitle,
      clientIds: data.clientIds,
      adminId: data.adminId,
      categoriesCount: data.categories?.length || 0
    });

    if (!data.clientIds || data.clientIds.length === 0) {
      console.warn('⚠️ Nenhum cliente selecionado para notificação');
      return false;
    }

    const { data: response, error } = await supabase.functions.invoke('send-video-notification', {
      body: {
        videoTitle: data.videoTitle,
        videoDescription: data.videoDescription || '',
        categories: data.categories || [],
        clientIds: data.clientIds,
        adminId: data.adminId
      }
    });

    if (error) {
      console.error('❌ Erro ao chamar função de envio de notificações:', error);
      return false;
    }

    console.log('✅ Resposta da função de notificações:', response);
    
    if (response?.success) {
      console.log(`📊 Notificações enviadas: ${response.emailsSent || 0} emails`);
      if (response.errors && response.errors.length > 0) {
        console.warn('⚠️ Alguns erros ocorreram:', response.errors);
      }
      return true;
    } else {
      console.error('❌ Função retornou erro:', response?.error || 'Erro desconhecido');
      return false;
    }

  } catch (error) {
    console.error('💥 Erro crítico no sendVideoNotifications:', error);
    return false;
  }
};

export const sendClientConfirmationEmail = async (data: ClientConfirmationData): Promise<boolean> => {
  try {
    console.log('Sending client confirmation email:', data);

    const { data: response, error } = await supabase.functions.invoke('send-client-confirmation', {
      body: data
    });

    if (error) {
      console.error('Error sending client confirmation email:', error);
      return false;
    }

    console.log('Client confirmation email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error in sendClientConfirmationEmail:', error);
    return false;
  }
};

export const getUserAuthInfo = async (userId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('get-user-auth-info', {
      body: { user_id: userId }
    });

    if (error) {
      console.error('Error getting user auth info:', error);
      return { email_confirmed_at: null, last_sign_in_at: null };
    }

    return data;
  } catch (error) {
    console.error('Error in getUserAuthInfo:', error);
    return { email_confirmed_at: null, last_sign_in_at: null };
  }
};
