
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

// Generate a random password
const generatePassword = (): string => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

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
  const password = generatePassword();
  
  // First, create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto-confirm the email
    user_metadata: {
      role: 'client'
    }
  });

  if (authError) {
    console.error('Erro ao criar usuário na autenticação:', authError);
    if (authError.message.includes('already registered')) {
      throw new Error('Este e-mail já está registrado no sistema');
    }
    throw authError;
  }

  // Then, add to client_users table
  const { error: clientUserError } = await supabase
    .from('client_users')
    .insert({
      client_id: clientId,
      user_email: email,
      created_by: createdBy
    });

  if (clientUserError) {
    console.error('Erro ao adicionar usuário ao cliente:', clientUserError);
    
    // If adding to client_users fails, we should clean up the auth user
    if (authData.user) {
      await supabase.auth.admin.deleteUser(authData.user.id);
    }
    
    if (clientUserError.code === '23505') {
      throw new Error('Este e-mail já está associado a este cliente');
    }
    throw clientUserError;
  }

  console.log('Usuário adicionado com sucesso');
  
  return {
    user: authData.user,
    password: password
  };
};

export const removeClientUser = async (clientUserId: string): Promise<void> => {
  console.log('Removendo usuário do cliente:', clientUserId);
  
  // First get the user email to find the auth user
  const { data: clientUser, error: fetchError } = await supabase
    .from('client_users')
    .select('user_email')
    .eq('id', clientUserId)
    .maybeSingle();

  if (fetchError) {
    console.error('Erro ao buscar usuário do cliente:', fetchError);
    throw fetchError;
  }

  if (!clientUser) {
    throw new Error('Usuário do cliente não encontrado');
  }

  // Remove from client_users table
  const { error: deleteError } = await supabase
    .from('client_users')
    .delete()
    .eq('id', clientUserId);

  if (deleteError) {
    console.error('Erro ao remover usuário do cliente:', deleteError);
    throw deleteError;
  }

  // Find and delete the auth user
  const { data: authUsers, error: authFetchError } = await supabase.auth.admin.listUsers();
  
  if (!authFetchError && authUsers) {
    const authUser = authUsers.users.find(user => user.email === clientUser.user_email);
    if (authUser) {
      await supabase.auth.admin.deleteUser(authUser.id);
      console.log('Usuário removido da autenticação também');
    }
  }

  console.log('Usuário removido com sucesso');
};
