
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface ClientData {
  name: string;
  email: string;
}

export interface ClientUserData {
  email: string;
  type: string;
}

export const getAdminName = async (supabaseAdmin: any, adminId: string): Promise<string> => {
  console.log('👤 Buscando nome do administrador...');
  
  const { data: admin, error: adminError } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', adminId)
    .single()

  if (adminError) {
    console.error('❌ Erro ao buscar administrador:', adminError)
    throw new Error('Administrador não encontrado')
  }

  const adminName = admin?.full_name || 'Administrador'
  console.log('✅ Admin encontrado:', adminName);
  return adminName
};

export const getClientData = async (supabaseAdmin: any, clientId: string): Promise<ClientData> => {
  console.log(`👥 Buscando dados do cliente: ${clientId}`);
  
  const { data: client, error: clientError } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email')
    .eq('id', clientId)
    .single()

  if (clientError) {
    console.error(`❌ Erro ao buscar cliente ${clientId}:`, clientError)
    throw new Error(`Cliente ${clientId}: ${clientError.message}`)
  }

  const clientName = client?.full_name || 'Cliente'
  const clientEmail = client?.email
  console.log(`✅ Cliente encontrado: ${clientName} (${clientEmail})`);

  return {
    name: clientName,
    email: clientEmail
  }
};

export const getClientUsers = async (supabaseAdmin: any, clientId: string): Promise<ClientUserData[]> => {
  console.log(`🔍 Buscando usuários para cliente: ${clientId}`);
  
  const { data: clientUsers, error: usersError } = await supabaseAdmin
    .from('client_users')
    .select('user_email')
    .eq('client_id', clientId)

  if (usersError) {
    console.error(`❌ Erro ao buscar usuários para cliente ${clientId}:`, usersError)
    throw new Error(`Usuários do cliente ${clientId}: ${usersError.message}`)
  }

  const users: ClientUserData[] = []
  
  if (clientUsers && clientUsers.length > 0) {
    for (const user of clientUsers) {
      users.push({
        email: user.user_email,
        type: 'usuário'
      });
    }
    console.log(`📧 ${clientUsers.length} usuários encontrados`);
  } else {
    console.log(`ℹ️ Nenhum usuário encontrado para cliente ${clientId}`);
  }

  return users
};

export const getAllEmailsForClient = async (supabaseAdmin: any, clientId: string): Promise<ClientUserData[]> => {
  const emailsToNotify: ClientUserData[] = [];

  try {
    // 1. Buscar dados do cliente
    const clientData = await getClientData(supabaseAdmin, clientId);
    
    // 2. Adicionar email do cliente se existir
    if (clientData.email) {
      emailsToNotify.push({
        email: clientData.email,
        type: 'cliente'
      });
      console.log(`📧 Email do cliente adicionado: ${clientData.email}`);
    }

    // 3. Buscar e adicionar usuários do cliente
    const clientUsers = await getClientUsers(supabaseAdmin, clientId);
    emailsToNotify.push(...clientUsers);

    console.log(`📤 Total de emails para notificar: ${emailsToNotify.length}`);
    return emailsToNotify;

  } catch (error) {
    console.error(`💥 Erro ao buscar emails para cliente ${clientId}:`, error);
    throw error;
  }
};
