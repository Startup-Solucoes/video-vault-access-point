
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const deleteClientFromDB = async (clientId: string, clientName: string): Promise<void> => {
  console.log('clientDeletionService: Removendo cliente:', clientId, clientName);
  
  if (!confirm(`Tem certeza que deseja remover o cliente "${clientName}"? Esta ação não pode ser desfeita.`)) {
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', clientId);

  if (error) {
    console.error('clientDeletionService: Erro ao remover cliente:', error);
    throw error;
  }

  console.log('clientDeletionService: Cliente removido com sucesso');
  toast({
    title: "Sucesso!",
    description: "Cliente removido com sucesso"
  });
};
