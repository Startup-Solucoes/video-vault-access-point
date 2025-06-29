
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate a strong password with requirements
const generatePassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const length = 14;
  
  // Ensure at least one character from each type
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Fill the rest of the password
  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const requestBody = await req.json()
    console.log('📥 Dados recebidos:', requestBody)

    const { client_id, user_email, admin_id } = requestBody

    if (!client_id || !user_email || !admin_id) {
      console.error('❌ Campos obrigatórios faltando:', { client_id, user_email, admin_id })
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: client_id, user_email e admin_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const email = user_email.toLowerCase().trim()
    const password = generatePassword()

    console.log('👤 Criando usuário:', { email, client_id, admin_id })

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'client'
      }
    })

    if (authError) {
      console.error('❌ Erro de autenticação:', authError)
      
      if (authError.message.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'Este e-mail já está registrado no sistema' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!authData.user) {
      console.error('❌ Usuário não foi criado')
      return new Response(
        JSON.stringify({ error: 'Falha na criação do usuário' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Usuário criado no Auth:', authData.user.id)

    // Add to client_users table
    const { error: clientUserError } = await supabaseAdmin
      .from('client_users')
      .insert({
        client_id: client_id,
        user_email: email,
        created_by: admin_id
      })

    if (clientUserError) {
      console.error('❌ Erro ao inserir client_users:', clientUserError)
      
      // If adding to client_users fails, clean up the auth user
      if (authData.user) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log('🧹 Usuário removido do Auth devido ao erro')
      }
      
      if (clientUserError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'Este e-mail já está associado a este cliente' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: clientUserError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Usuário adicionado à tabela client_users')

    return new Response(
      JSON.stringify({
        user: authData.user,
        password: password
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('💥 Erro na função:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
