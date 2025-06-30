
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
      throw new Error('Erro ao atualizar senha: ' + updateError.message)
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
