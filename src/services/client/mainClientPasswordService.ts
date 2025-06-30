
import { supabase } from '@/integrations/supabase/client';

export const updateMainClientPassword = async (
  clientId: string, 
  newPassword: string
): Promise<void> => {
  console.log('🔑 Atualizando senha do cliente principal:', clientId);

  if (!newPassword || newPassword.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  try {
    const { error } = await supabase.functions.invoke('update-main-client-password', {
      body: {
        client_id: clientId,
        new_password: newPassword
      }
    });

    if (error) {
      console.error('❌ Erro ao atualizar senha do cliente principal:', error);
      throw new Error(error.message || 'Erro ao atualizar senha');
    }

    console.log('✅ Senha do cliente principal atualizada com sucesso');
  } catch (error) {
    console.error('💥 Erro ao atualizar senha do cliente principal:', error);
    throw error;
  }
};
