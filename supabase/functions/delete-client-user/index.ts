
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { clientUserId } = await req.json()

    if (!clientUserId) {
      return new Response(
        JSON.stringify({ error: 'Missing client user ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Deleting client user:', clientUserId)

    // First get the user email to find the auth user
    const { data: clientUser, error: fetchError } = await supabaseAdmin
      .from('client_users')
      .select('user_email')
      .eq('id', clientUserId)
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
      .eq('id', clientUserId)

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
