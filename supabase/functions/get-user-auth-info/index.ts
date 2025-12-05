
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!serviceRoleKey) {
      throw new Error('Service role key not configured')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // VERIFICAÇÃO DE ADMIN
    const authHeader = req.headers.get('Authorization');
    const { isAdmin, userId, error: authError } = await verifyAdmin(supabaseAdmin, authHeader);
    
    if (!isAdmin) {
      console.error('🚫 Acesso negado - usuário não é admin:', userId);
      return new Response(
        JSON.stringify({ error: authError || 'Acesso negado. Apenas administradores podem acessar informações de autenticação.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Admin verificado:', userId);

    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user_id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(user_id)

    if (error) {
      console.error('Error fetching user auth info:', error)
      return new Response(
        JSON.stringify({ 
          email_confirmed_at: null,
          last_sign_in_at: null 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const authInfo = {
      email_confirmed_at: user.user?.email_confirmed_at || null,
      last_sign_in_at: user.user?.last_sign_in_at || null
    }

    return new Response(
      JSON.stringify(authInfo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        email_confirmed_at: null,
        last_sign_in_at: null 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
