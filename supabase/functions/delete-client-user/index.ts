
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

    // VERIFICAÇÃO DE ADMIN
    const authHeader = req.headers.get('Authorization');
    const { isAdmin, userId, error: authError } = await verifyAdmin(supabaseAdmin, authHeader);
    
    if (!isAdmin) {
      console.error('🚫 Acesso negado - usuário não é admin:', userId);
      return new Response(
        JSON.stringify({ error: authError || 'Acesso negado. Apenas administradores podem deletar usuários.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Admin verificado:', userId);

    const { client_user_id } = await req.json()

    if (!client_user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing client user ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Deleting client user:', client_user_id)

    // First get the user email to find the auth user
    const { data: clientUser, error: fetchError } = await supabaseAdmin
      .from('client_users')
      .select('user_email')
      .eq('id', client_user_id)
      .maybeSingle()

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!clientUser) {
      return new Response(
        JSON.stringify({ error: 'Usuário do cliente não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Remove from client_users table
    const { error: deleteError } = await supabaseAdmin
      .from('client_users')
      .delete()
      .eq('id', client_user_id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return new Response(
        JSON.stringify({ error: deleteError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find and delete the auth user
    const { data: authUsers, error: authFetchError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (!authFetchError && authUsers && authUsers.users) {
      const authUser = authUsers.users.find((user: any) => user.email === clientUser.user_email)
      if (authUser && authUser.id) {
        await supabaseAdmin.auth.admin.deleteUser(authUser.id)
        console.log('User removed from auth as well')
      }
    }

    // Log security event
    try {
      const userAgent = req.headers.get('user-agent') || 'Unknown';
      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
      
      await supabaseAdmin.rpc('log_security_event', {
        p_action: 'client_user_deleted',
        p_details: { 
          client_user_id, 
          user_email: clientUser.user_email,
          deleted_by_admin: userId 
        },
        p_ip_address: clientIP,
        p_user_agent: userAgent
      });
    } catch (logError) {
      console.error('Erro ao registrar evento de segurança:', logError);
    }

    console.log('Client user deleted successfully')

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
