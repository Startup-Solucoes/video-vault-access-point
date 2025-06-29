
import { supabase } from '@/integrations/supabase/client';

export interface ClientUser {
  id: string;
  user_email: string;
  client_id: string;
  created_at: string;
  generated_password?: string; // Senha gerada automaticamente
}

export interface CreateUserResult {
  user: {
    id: string;
    email: string;
  };
  password: string;
}

export const fetchClientUsers = async (clientId: string): Promise<ClientUser[]> => {
  if (!clientId) return [];

  console.log('🔍 Buscando usuários do cliente:', clientId);
  
  const { data, error } = await supabase
    .from('client_users')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro ao buscar usuários do cliente:', error);
    throw new Error(`Erro ao buscar usuários: ${error.message}`);
  }

  console.log('✅ Usuários encontrados:', data?.length || 0);
  return data || [];
};

export const addClientUser = async (
  clientId: string, 
  userEmail: string, 
  adminId: string
): Promise<CreateUserResult> => {
  console.log('👤 Criando usuário para cliente:', { clientId, userEmail, adminId });

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    throw new Error('Email inválido');
  }

  // Verificar se o email já existe
  const { data: existingUsers } = await supabase
    .from('client_users')
    .select('user_email')
    .eq('user_email', userEmail.toLowerCase());

  if (existingUsers && existingUsers.length > 0) {
    throw new Error('Este email já está cadastrado no sistema');
  }

  try {
    console.log('📤 Enviando dados para a função:', {
      client_id: clientId,
      user_email: userEmail.toLowerCase(),
      admin_id: adminId
    });

    const { data, error } = await supabase.functions.invoke('create-client-user', {
      body: {
        client_id: clientId,
        user_email: userEmail.toLowerCase(),
        admin_id: adminId
      }
    });

    if (error) {
      console.error('❌ Erro na função create-client-user:', error);
      throw new Error(error.message || 'Erro ao criar usuário');
    }

    if (!data || !data.user || !data.password) {
      console.error('❌ Resposta inválida da função:', data);
      throw new Error('Resposta inválida do servidor');
    }

    console.log('✅ Usuário criado com sucesso:', data.user.email);
    
    return {
      user: data.user,
      password: data.password
    };
  } catch (error) {
    console.error('💥 Erro ao criar usuário:', error);
    throw error;
  }
};

export const removeClientUser = async (clientUserId: string): Promise<void> => {
  console.log('🗑️ Removendo usuário:', clientUserId);

  const { error } = await supabase.functions.invoke('delete-client-user', {
    body: { client_user_id: clientUserId }
  });

  if (error) {
    console.error('❌ Erro ao remover usuário:', error);
    throw new Error(`Erro ao remover usuário: ${error.message}`);
  }

  console.log('✅ Usuário removido com sucesso');
};
