
import { supabase } from '@/integrations/supabase/client';

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
  console.log('clientUsersService: Buscando usuários do cliente:', clientId);
  
  if (!clientId) {
    throw new Error('ID do cliente é obrigatório');
  }
  
  const { data, error } = await supabase
    .from('client_users')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('clientUsersService: Erro ao buscar usuários do cliente:', error);
    throw error;
  }

  console.log('clientUsersService: Usuários encontrados:', data?.length || 0);
  return data || [];
};

export const addClientUser = async (
  clientId: string, 
  userEmail: string, 
  createdBy: string
): Promise<CreateUserResult> => {
  console.log('clientUsersService: Adicionando usuário ao cliente:', { clientId, userEmail, createdBy });
  
  // Validação dos dados
  if (!clientId || !userEmail || !createdBy) {
    throw new Error('Todos os campos são obrigatórios');
  }

  const email = userEmail.toLowerCase().trim();
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email inválido');
  }

  try {
    // Chamar a Edge Function para criar o usuário
    const { data, error } = await supabase.functions.invoke('create-client-user', {
      body: {
        clientId,
        userEmail: email,
        createdBy
      }
    });

    if (error) {
      console.error('clientUsersService: Erro na função:', error);
      throw new Error(error.message || 'Erro ao criar usuário');
    }

    if (data?.error) {
      console.error('clientUsersService: Erro retornado pela função:', data.error);
      throw new Error(data.error);
    }

    console.log('clientUsersService: Usuário adicionado com sucesso');
    
    return {
      user: data.user,
      password: data.password
    };
  } catch (error) {
    console.error('clientUsersService: Erro no processo de criação:', error);
    throw error;
  }
};

export const removeClientUser = async (clientUserId: string): Promise<void> => {
  console.log('clientUsersService: Removendo usuário do cliente:', clientUserId);
  
  if (!clientUserId) {
    throw new Error('ID do usuário é obrigatório');
  }

  try {
    // Chamar a Edge Function para deletar o usuário
    const { data, error } = await supabase.functions.invoke('delete-client-user', {
      body: {
        clientUserId
      }
    });

    if (error) {
      console.error('clientUsersService: Erro na função:', error);
      throw new Error(error.message || 'Erro ao remover usuário');
    }

    if (data?.error) {
      console.error('clientUsersService: Erro retornado pela função:', data.error);
      throw new Error(data.error);
    }

    console.log('clientUsersService: Usuário removido com sucesso');
  } catch (error) {
    console.error('clientUsersService: Erro no processo de remoção:', error);
    throw error;
  }
};
