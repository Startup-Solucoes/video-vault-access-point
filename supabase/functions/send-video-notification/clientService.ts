
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
  console.log('👤 Buscando nome do administrador:', adminId);
  
  const { data: admin, error: adminError } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', adminId)
    .single()

  if (adminError) {
    console.error('❌ Erro ao buscar administrador:', adminError)
    throw new Error(`Administrador não encontrado: ${adminError.message}`)
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
  console.log(`🔍 Buscando usuários adicionais para cliente: ${clientId}`);
  
  const { data: clientUsers, error: usersError } = await supabaseAdmin
    .from('client_users')
    .select('user_email')
    .eq('client_id', clientId)

  if (usersError) {
    console.error(`❌ Erro ao buscar usuários para cliente ${clientId}:`, usersError)
    // Não falha aqui, apenas retorna array vazio
    console.log(`ℹ️ Continuando sem usuários adicionais para cliente ${clientId}`);
    return []
  }

  const users: ClientUserData[] = []
  
  if (clientUsers && clientUsers.length > 0) {
    for (const user of clientUsers) {
      users.push({
        email: user.user_email,
        type: 'usuário adicional'
      });
    }
    console.log(`📧 ${clientUsers.length} usuário(s) adicional(is) encontrado(s)`);
  } else {
    console.log(`ℹ️ Nenhum usuário adicional encontrado para cliente ${clientId}`);
  }

  return users
};

export const getAllEmailsForClient = async (supabaseAdmin: any, clientId: string): Promise<ClientUserData[]> => {
  console.log(`📧 === COLETANDO TODOS OS EMAILS PARA CLIENTE ${clientId} ===`);
  const emailsToNotify: ClientUserData[] = [];

  try {
    // 1. Buscar dados do cliente principal
    const clientData = await getClientData(supabaseAdmin, clientId);
    
    // 2. Adicionar email do cliente principal se existir
    if (clientData.email) {
      emailsToNotify.push({
        email: clientData.email,
        type: 'cliente principal'
      });
      console.log(`📧 Email do cliente principal adicionado: ${clientData.email}`);
    } else {
      console.log(`⚠️ Cliente principal ${clientId} não possui email cadastrado`);
    }

    // 3. Buscar e adicionar usuários adicionais do cliente
    const clientUsers = await getClientUsers(supabaseAdmin, clientId);
    if (clientUsers.length > 0) {
      emailsToNotify.push(...clientUsers);
      console.log(`📧 ${clientUsers.length} usuário(s) adicional(is) adicionado(s)`);
    }

    console.log(`📤 Total de emails coletados para cliente ${clientId}: ${emailsToNotify.length}`);
    console.log('📋 Lista de destinatários:', emailsToNotify.map(e => `${e.email} (${e.type})`));
    
    return emailsToNotify;

  } catch (error) {
    console.error(`💥 Erro ao buscar emails para cliente ${clientId}:`, error);
    // Em caso de erro, retorna array vazio para não quebrar o processo
    return [];
  }
};
