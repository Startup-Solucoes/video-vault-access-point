
import { supabase } from '@/integrations/supabase/client';

export const deleteClientFromDB = async (clientId: string, clientName: string): Promise<void> => {
  console.log('clientDeletionService: Removendo cliente:', clientId, clientName);
  
  if (!confirm(`Tem certeza que deseja remover o cliente "${clientName}"? Esta ação não pode ser desfeita.`)) {
    throw new Error('Operação cancelada pelo usuário');
  }

  try {
    // Primeiro, verificar se o cliente existe
    const { data: existingClient, error: checkError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', clientId)
      .single();

    if (checkError || !existingClient) {
      throw new Error('Cliente não encontrado');
    }

    // Remover cliente (cascade irá remover registros relacionados)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', clientId);

    if (error) {
      console.error('clientDeletionService: Erro ao remover cliente:', error);
      throw error;
    }

    console.log('clientDeletionService: Cliente removido com sucesso');
  } catch (error) {
    console.error('clientDeletionService: Erro no processo de remoção:', error);
    throw error;
  }
};
