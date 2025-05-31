
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { EditClientForm } from '@/types/client';

export const updateClientInDB = async (clientId: string, editForm: EditClientForm): Promise<void> => {
  console.log('clientUpdateService: Atualizando cliente:', clientId, editForm);
  
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: editForm.full_name,
      email: editForm.email,
      logo_url: editForm.logo_url || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', clientId);

  if (error) {
    console.error('clientUpdateService: Erro ao atualizar cliente:', error);
    throw error;
  }

  console.log('clientUpdateService: Cliente atualizado com sucesso');
  toast({
    title: "Sucesso!",
    description: "Cliente atualizado com sucesso"
  });
};
