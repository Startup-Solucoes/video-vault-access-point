
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para verificar se o usuário é admin
async function verifyAdmin(supabaseAdmin: any, authHeader: string | null): Promise<{ isAdmin: boolean; userId: string | null; error?: string }> {
  if (!authHeader) {
    return { isAdmin: false, userId: null, error: 'Token de autorização não fornecido' };
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Verificar o token e obter o usuário
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  
  if (userError || !user) {
    console.error('Erro ao verificar usuário:', userError);
    return { isAdmin: false, userId: null, error: 'Token inválido ou expirado' };
  }

  // Verificar se o usuário é admin
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Erro ao buscar perfil:', profileError);
    return { isAdmin: false, userId: user.id, error: 'Perfil não encontrado' };
  }

  return { isAdmin: profile.role === 'admin', userId: user.id };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // VERIFICAÇÃO DE ADMIN
    const authHeader = req.headers.get('Authorization');
    const { isAdmin, userId, error: authError } = await verifyAdmin(supabaseClient, authHeader);
    
    if (!isAdmin) {
      console.error('🚫 Acesso negado - usuário não é admin:', userId);
      return new Response(
        JSON.stringify({ error: authError || 'Acesso negado. Apenas administradores podem alterar senhas.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Admin verificado:', userId);

    const { client_user_id, new_password } = await req.json()
    
    // Log security event info
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';

    console.log('🔑 Atualizando senha para client_user_id:', client_user_id)

    if (!client_user_id || !new_password) {
      throw new Error('client_user_id e new_password são obrigatórios')
    }

    if (new_password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres')
    }

    // Buscar informações do usuário
    const { data: clientUser, error: clientUserError } = await supabaseClient
      .from('client_users')
      .select('user_email')
      .eq('id', client_user_id)
      .single()

    if (clientUserError || !clientUser) {
      console.error('❌ Erro ao buscar client_user:', clientUserError)
      throw new Error('Usuário não encontrado')
    }

    // Buscar o usuário no auth.users pelo email
    const { data: authUsers, error: authError2 } = await supabaseClient.auth.admin.listUsers()
    
    if (authError2) {
      console.error('❌ Erro ao listar usuários:', authError2)
      throw new Error('Erro ao buscar usuários de autenticação')
    }

    const authUser = authUsers.users.find(user => user.email === clientUser.user_email)
    
    if (!authUser) {
      throw new Error('Usuário de autenticação não encontrado')
    }

    // Atualizar a senha do usuário
    const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
      authUser.id,
      { password: new_password }
    )

    if (updateError) {
      console.error('❌ Erro ao atualizar senha:', updateError)
      
      // Log failed password change attempt
      try {
        await supabaseClient.rpc('log_security_event', {
          p_action: 'client_password_change_failed',
          p_details: { 
            client_user_id, 
            user_email: clientUser.user_email, 
            error: updateError.message,
            attempted_by_admin: userId 
          },
          p_ip_address: clientIP,
          p_user_agent: userAgent
        });
      } catch (logError) {
        console.error('Erro ao registrar evento de segurança:', logError);
      }
      
      throw new Error('Erro ao atualizar senha: ' + updateError.message)
    }

    // Log successful password change
    try {
      await supabaseClient.rpc('log_security_event', {
        p_action: 'client_password_changed',
        p_details: { 
          client_user_id, 
          user_email: clientUser.user_email,
          changed_by_admin: userId 
        },
        p_ip_address: clientIP,
        p_user_agent: userAgent
      });
    } catch (logError) {
      console.error('Erro ao registrar evento de segurança:', logError);
    }

    console.log('✅ Senha atualizada com sucesso para:', clientUser.user_email)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Senha atualizada com sucesso'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('💥 Erro na função update-client-user-password:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Erro interno do servidor'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
