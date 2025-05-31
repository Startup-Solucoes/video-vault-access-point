
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ClientUser {
  id: string;
  client_id: string;
  user_email: string;
  created_at: string;
  created_by: string;
}

export const fetchClientUsers = async (clientId: string): Promise<ClientUser[]> => {
  console.log('Buscando usuários do cliente:', clientId);
  
  const { data, error } = await supabase
    .from('client_users')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar usuários do cliente:', error);
    throw error;
  }

  return data || [];
};

export const addClientUser = async (clientId: string, userEmail: string, createdBy: string): Promise<void> => {
  console.log('Adicionando usuário ao cliente:', { clientId, userEmail, createdBy });
  
  const { error } = await supabase
    .from('client_users')
    .insert({
      client_id: clientId,
      user_email: userEmail.toLowerCase().trim(),
      created_by: createdBy
    });

  if (error) {
    console.error('Erro ao adicionar usuário ao cliente:', error);
    if (error.code === '23505') {
      throw new Error('Este e-mail já está associado a este cliente');
    }
    throw error;
  }

  console.log('Usuário adicionado com sucesso');
};

export const removeClientUser = async (clientUserId: string): Promise<void> => {
  console.log('Removendo usuário do cliente:', clientUserId);
  
  const { error } = await supabase
    .from('client_users')
    .delete()
    .eq('id', clientUserId);

  if (error) {
    console.error('Erro ao remover usuário do cliente:', error);
    throw error;
  }

  console.log('Usuário removido com sucesso');
};
