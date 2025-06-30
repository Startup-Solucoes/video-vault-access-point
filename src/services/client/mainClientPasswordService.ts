
import { supabase } from '@/integrations/supabase/client';

export const updateMainClientPassword = async (
  clientId: string, 
  newPassword: string
): Promise<void> => {
  console.log('🔑 Atualizando senha do cliente principal:', clientId);

  if (!newPassword || newPassword.length < 8) {
    throw new Error('A senha deve ter pelo menos 8 caracteres');
  }

  // Validar se a senha é forte o suficiente
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumbers = /\d/.test(newPassword);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(newPassword);

  if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSymbols) {
    throw new Error('A senha deve conter pelo menos: 1 letra maiúscula, 1 minúscula, 1 número e 1 símbolo');
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
      
      // Melhorar mensagens de erro específicas
      if (error.message?.includes('weak') || error.message?.includes('easy to guess')) {
        throw new Error('Senha muito fraca. Por favor, use uma senha mais complexa com letras, números e símbolos.');
      } else if (error.message?.includes('pwned')) {
        throw new Error('Esta senha foi encontrada em vazamentos de dados. Por favor, escolha uma senha diferente.');
      } else {
        throw new Error(error.message || 'Erro ao atualizar senha');
      }
    }

    console.log('✅ Senha do cliente principal atualizada com sucesso');
  } catch (error) {
    console.error('💥 Erro ao atualizar senha do cliente principal:', error);
    throw error;
  }
};
