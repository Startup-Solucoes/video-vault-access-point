
import { supabase } from '@/integrations/supabase/client';

export const deleteClientFromDB = async (clientId: string, clientName: string): Promise<void> => {
  console.log('clientDeletionService: Marcando cliente como excluído:', clientId, clientName);
  
  if (!confirm(`Tem certeza que deseja remover o cliente "${clientName}"? Esta ação pode ser revertida.`)) {
    throw new Error('Operação cancelada pelo usuário');
  }

  try {
    // Primeiro, verificar se o cliente existe
    const { data: existingClient, error: checkError } = await supabase
      .from('profiles')
      .select('id, full_name, is_deleted')
      .eq('id', clientId)
      .single();

    if (checkError || !existingClient) {
      throw new Error('Cliente não encontrado');
    }

    if (existingClient.is_deleted) {
      throw new Error('Cliente já foi excluído anteriormente');
    }

    // Marcar cliente como excluído (soft delete)
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId);

    if (error) {
      console.error('clientDeletionService: Erro ao marcar cliente como excluído:', error);
      throw error;
    }

    console.log('clientDeletionService: Cliente marcado como excluído com sucesso');
  } catch (error) {
    console.error('clientDeletionService: Erro no processo de exclusão:', error);
    throw error;
  }
};
