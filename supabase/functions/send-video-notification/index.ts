
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

    const requestBody = await req.json()
    console.log('📝 Dados recebidos:', requestBody);

    const { videoTitle, videoDescription, categories, clientIds, adminId } = requestBody

    if (!videoTitle || !clientIds || !Array.isArray(clientIds) || clientIds.length === 0 || !adminId) {
      console.error('❌ Campos obrigatórios não informados');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Campos obrigatórios não informados: videoTitle, clientIds (array), adminId' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('👤 Buscando dados do administrador:', adminId);
    
    // Buscar nome do administrador
    let adminName = 'Administrador';
    try {
      adminName = await getAdminName(supabaseAdmin, adminId);
    } catch (error) {
      console.warn('⚠️ Não foi possível buscar nome do admin, usando padrão:', error.message);
    }

    let totalEmailsSent = 0;
    let errors = [];

    // URL da dashboard
    const dashboardUrl = 'https://tutoriaiserp.com.br'

    console.log(`🔄 Processando ${clientIds.length} cliente(s) selecionado(s)...`);
    
    // Para cada cliente, buscar seus dados e usuários e enviar notificações
    for (const clientId of clientIds) {
      try {
        console.log(`\n👥 === PROCESSANDO CLIENTE: ${clientId} ===`);
        
        // Buscar todos os emails para este cliente (cliente principal + usuários adicionais)
        const emailsToNotify = await getAllEmailsForClient(supabaseAdmin, clientId);
        
        if (emailsToNotify.length === 0) {
          console.log(`ℹ️ Nenhum email encontrado para cliente ${clientId}`);
          continue;
        }

        console.log(`📧 Encontrados ${emailsToNotify.length} destinatário(s) para cliente ${clientId}`);

        // Buscar dados do cliente para usar no template
        const { data: clientData, error: clientError } = await supabaseAdmin
          .from('profiles')
          .select('full_name')
          .eq('id', clientId)
          .single();

        const clientName = clientData?.full_name || 'Cliente';

        // Enviar email para todos os destinatários do cliente
        for (const recipient of emailsToNotify) {
          console.log(`📤 Enviando email para ${recipient.type}: ${recipient.email}`);
          
          const emailBody = createEmailTemplate(
            videoTitle, 
            videoDescription || '', 
            categories || [], 
            clientName, 
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
            console.log(`✅ Email enviado com sucesso para ${recipient.type}: ${recipient.email}`);
          } else {
            console.error(`❌ Falha ao enviar email para ${recipient.type}: ${recipient.email}`);
            errors.push(`Falha ao enviar email para ${recipient.email}`)
          }
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
      message: `Processamento concluído. ${totalEmailsSent} emails enviados para ${clientIds.length} cliente(s).`
    }

    console.log('\n🎉 === RESUMO FINAL ===');
    console.log('📊 Emails enviados:', totalEmailsSent);
    console.log('❌ Erros:', errors.length);
    console.log('✅ Processo concluído');

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('💥 Erro geral na função:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro interno do servidor', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
