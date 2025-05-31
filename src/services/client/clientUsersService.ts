
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ClientUser {
  id: string;
  client_id: string;
  user_email: string;
  created_at: string;
  created_by: string;
}

export interface CreateUserResult {
  user: any;
  password: string;
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

export const addClientUser = async (
  clientId: string, 
  userEmail: string, 
  createdBy: string
): Promise<CreateUserResult> => {
  console.log('Adicionando usuário ao cliente:', { clientId, userEmail, createdBy });
  
  const email = userEmail.toLowerCase().trim();
  
  // Call the Edge Function to create the user
  const { data, error } = await supabase.functions.invoke('create-client-user', {
    body: {
      clientId,
      userEmail: email,
      createdBy
    }
  });

  if (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error(error.message || 'Erro ao criar usuário');
  }

  if (data.error) {
    console.error('Erro retornado pela função:', data.error);
    throw new Error(data.error);
  }

  console.log('Usuário adicionado com sucesso');
  
  return {
    user: data.user,
    password: data.password
  };
};

export const removeClientUser = async (clientUserId: string): Promise<void> => {
  console.log('Removendo usuário do cliente:', clientUserId);
  
  // Call the Edge Function to delete the user
  const { data, error } = await supabase.functions.invoke('delete-client-user', {
    body: {
      clientUserId
    }
  });

  if (error) {
    console.error('Erro ao remover usuário:', error);
    throw new Error(error.message || 'Erro ao remover usuário');
  }

  if (data.error) {
    console.error('Erro retornado pela função:', data.error);
    throw new Error(data.error);
  }

  console.log('Usuário removido com sucesso');
};
