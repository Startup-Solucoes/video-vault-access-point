
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { client_id, new_password } = await req.json()
    
    // Log security event info
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';

    console.log('🔑 Atualizando senha do cliente principal:', client_id)

    if (!client_id || !new_password) {
      throw new Error('client_id e new_password são obrigatórios')
    }

    if (new_password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres')
    }

    // Buscar informações do cliente principal
    const { data: clientProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('id', client_id)
      .single()

    if (profileError || !clientProfile) {
      console.error('❌ Erro ao buscar perfil do cliente:', profileError)
      throw new Error('Cliente não encontrado')
    }

    // Buscar o usuário no auth.users pelo email
    const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro ao listar usuários:', authError)
      throw new Error('Erro ao buscar usuários de autenticação')
    }

    const authUser = authUsers.users.find(user => user.email === clientProfile.email)
    
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
          p_action: 'main_client_password_change_failed',
          p_details: { client_id, client_email: clientProfile.email, error: updateError.message },
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
        p_action: 'main_client_password_changed',
        p_details: { client_id, client_email: clientProfile.email },
        p_ip_address: clientIP,
        p_user_agent: userAgent
      });
    } catch (logError) {
      console.error('Erro ao registrar evento de segurança:', logError);
    }

    console.log('✅ Senha do cliente principal atualizada com sucesso para:', clientProfile.email)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Senha do cliente principal atualizada com sucesso'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('💥 Erro na função update-main-client-password:', error)
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
