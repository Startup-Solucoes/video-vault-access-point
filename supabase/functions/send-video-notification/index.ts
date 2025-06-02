
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sendEmail } from './emailService.ts'
import { createEmailTemplate } from './emailTemplates.ts'
import { getAdminName, getAllEmailsForClient } from './clientService.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Tratar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 === INICIANDO ENVIO DE NOTIFICAÇÕES ===');
    
    // Criar cliente admin com service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const { videoTitle, videoDescription, categories, clientIds, adminId } = await req.json()

    console.log('📝 Dados recebidos:', { 
      videoTitle, 
      videoDescription: videoDescription ? 'Presente' : 'Ausente',
      categories: categories?.length || 0,
      clientIds: clientIds?.length || 0,
      adminId 
    });

    if (!videoTitle || !clientIds || !Array.isArray(clientIds) || !adminId) {
      console.error('❌ Campos obrigatórios não informados');
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios não informados: videoTitle, clientIds, adminId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar nome do administrador
    const adminName = await getAdminName(supabaseAdmin, adminId);

    let totalEmailsSent = 0;
    let errors = [];

    // URL da dashboard
    const dashboardUrl = 'https://tutoriaiserp.com.br'

    console.log('🔄 Processando clientes selecionados...');
    
    // Para cada cliente, buscar seus dados e usuários e enviar notificações
    for (const clientId of clientIds) {
      try {
        console.log(`\n👥 Processando cliente: ${clientId}`);
        
        // Buscar todos os emails para este cliente (cliente + usuários)
        const emailsToNotify = await getAllEmailsForClient(supabaseAdmin, clientId);
        const clientData = await import('./clientService.ts').then(module => 
          module.getClientData(supabaseAdmin, clientId)
        );

        // Enviar email para todos na lista
        if (emailsToNotify.length > 0) {
          for (const recipient of emailsToNotify) {
            console.log(`📤 Preparando email para ${recipient.type}: ${recipient.email}`);
            
            const emailBody = createEmailTemplate(
              videoTitle, 
              videoDescription || '', 
              categories || [], 
              clientData.name, 
              adminName,
              dashboardUrl
            )
            
            const emailSent = await sendEmail({
              to: recipient.email,
              subject: `🎬 Novo tutorial foi adicionado à sua conta`,
              body: emailBody
            })

            if (emailSent) {
              totalEmailsSent++
              console.log(`✅ Email enviado para ${recipient.type}: ${recipient.email}`);
            } else {
              console.error(`❌ Falha ao enviar email para ${recipient.type}: ${recipient.email}`);
              errors.push(`Falha ao enviar email para ${recipient.email}`)
            }
          }
        } else {
          console.log(`ℹ️ Nenhum email encontrado para notificar sobre o cliente ${clientData.name}`);
        }
      } catch (error) {
        console.error(`💥 Erro ao processar cliente ${clientId}:`, error)
        errors.push(`Cliente ${clientId}: ${error.message}`)
      }
    }

    const response = {
      success: true,
      emailsSent: totalEmailsSent,
      errors: errors.length > 0 ? errors : undefined,
      message: `Processamento concluído. ${totalEmailsSent} emails enviados.`
    }

    console.log('\n🎉 === RESUMO FINAL ===');
    console.log('📊 Emails enviados:', totalEmailsSent);
    console.log('❌ Erros:', errors.length);
    console.log('✅ Processo concluído com sucesso');

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('💥 Erro geral na função:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
