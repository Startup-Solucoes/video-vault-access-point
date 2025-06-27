
import { supabase } from '@/integrations/supabase/client';

export const updateClientUserPassword = async (
  clientUserId: string, 
  newPassword: string
): Promise<void> => {
  console.log('🔑 Atualizando senha do usuário:', clientUserId);

  if (!newPassword || newPassword.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  try {
    const { error } = await supabase.functions.invoke('update-client-user-password', {
      body: {
        client_user_id: clientUserId,
        new_password: newPassword
      }
    });

    if (error) {
      console.error('❌ Erro ao atualizar senha:', error);
      throw new Error(error.message || 'Erro ao atualizar senha');
    }

    console.log('✅ Senha atualizada com sucesso');
  } catch (error) {
    console.error('💥 Erro ao atualizar senha:', error);
    throw error;
  }
};
