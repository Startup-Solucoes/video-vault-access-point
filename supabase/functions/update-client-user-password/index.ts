
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

    const { client_user_id, new_password } = await req.json()

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
    const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro ao listar usuários:', authError)
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
      throw new Error('Erro ao atualizar senha: ' + updateError.message)
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
