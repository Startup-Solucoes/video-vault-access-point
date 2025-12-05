
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
  
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  
  if (userError || !user) {
    console.error('Erro ao verificar usuário:', userError);
    return { isAdmin: false, userId: null, error: 'Token inválido ou expirado' };
  }

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

// Generate a strong password with requirements
const generatePassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const length = 14;
  
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  const allChars = lowercase + uppercase + numbers + specialChars;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // VERIFICAÇÃO DE ADMIN
    const authHeader = req.headers.get('Authorization');
    const { isAdmin, userId, error: authError } = await verifyAdmin(supabaseAdmin, authHeader);
    
    if (!isAdmin) {
      console.error('🚫 Acesso negado - usuário não é admin:', userId);
      return new Response(
        JSON.stringify({ error: authError || 'Acesso negado. Apenas administradores podem criar usuários.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Admin verificado:', userId);

    const requestBody = await req.json()
    console.log('📥 Dados recebidos:', requestBody)

    const { client_id, user_email, admin_id } = requestBody

    if (!client_id || !user_email) {
      console.error('❌ Campos obrigatórios faltando:', { client_id, user_email })
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: client_id e user_email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const email = user_email.toLowerCase().trim()
    const password = generatePassword()

    console.log('👤 Criando usuário:', { email, client_id })

    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'client'
      }
    })

    if (createError) {
      console.error('❌ Erro de autenticação:', createError)
      
      if (createError.message.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'Este e-mail já está registrado no sistema' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: createError.message }),
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

    const { error: clientUserError } = await supabaseAdmin
      .from('client_users')
      .insert({
        client_id: client_id,
        user_email: email,
        created_by: admin_id || userId
      })

    if (clientUserError) {
      console.error('❌ Erro ao inserir client_users:', clientUserError)
      
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

    // Log security event
    try {
      const userAgent = req.headers.get('user-agent') || 'Unknown';
      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
      
      await supabaseAdmin.rpc('log_security_event', {
        p_action: 'client_user_created',
        p_details: { 
          client_id, 
          user_email: email, 
          created_by_admin: userId 
        },
        p_ip_address: clientIP,
        p_user_agent: userAgent
      });
    } catch (logError) {
      console.error('Erro ao registrar evento de segurança:', logError);
    }

    console.log('✅ Usuário adicionado à tabela client_users')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuário criado com sucesso',
        user: {
          id: authData.user.id,
          email: authData.user.email
        },
        // TODO: Implementar método mais seguro (ex: email ou token temporário)
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
