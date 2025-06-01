
import { supabase } from '@/integrations/supabase/client';
import { EditClientForm } from '@/types/client';

export const updateClientInDB = async (clientId: string, editForm: EditClientForm): Promise<void> => {
  console.log('clientUpdateService: Atualizando cliente:', clientId, editForm);
  
  // Validação dos dados antes de enviar
  if (!editForm.full_name?.trim()) {
    throw new Error('Nome completo é obrigatório');
  }
  
  if (!editForm.email?.trim()) {
    throw new Error('Email é obrigatório');
  }

  const updateData = {
    full_name: editForm.full_name.trim(),
    email: editForm.email.trim().toLowerCase(),
    logo_url: editForm.logo_url?.trim() || null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', clientId);

  if (error) {
    console.error('clientUpdateService: Erro ao atualizar cliente:', error);
    throw error;
  }

  console.log('clientUpdateService: Cliente atualizado com sucesso');
};
