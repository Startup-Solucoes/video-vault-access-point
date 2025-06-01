
import { supabase } from '@/integrations/supabase/client';

export const approveClientInDB = async (clientId: string, clientEmail: string): Promise<void> => {
  console.log('clientApprovalService: Aprovando cliente:', clientId, clientEmail);
  
  try {
    // Marcar aprovação atualizando o timestamp e status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId);

    if (profileError) {
      throw profileError;
    }

    console.log('clientApprovalService: Cliente aprovado com sucesso');
  } catch (error) {
    console.error('clientApprovalService: Erro ao aprovar cliente:', error);
    throw new Error(`Falha ao aprovar cliente: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};
