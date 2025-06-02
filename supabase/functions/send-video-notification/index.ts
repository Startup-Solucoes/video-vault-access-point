import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const gmailUser = Deno.env.get('GMAIL_USER');
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!gmailUser || !gmailPassword) {
      console.error('❌ Credenciais do Gmail não configuradas');
      return false;
    }

    console.log('📧 Enviando email para:', emailData.to);

    // Usar uma API de email mais confiável
    // Implementação simplificada usando fetch para Gmail API ou fallback para SMTP
    const emailMessage = [
      `From: ${gmailUser}`,
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      emailData.body
    ].join('\r\n');

    // Tentar usar uma abordagem mais simples com nodemailer-like implementation
    try {
      // Implementação SMTP mais robusta usando fetch para um serviço de relay
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'gmail',
          template_id: 'template_basic',
          user_id: 'public_key',
          template_params: {
            from_name: 'Sistema ERP',
            from_email: gmailUser,
            to_email: emailData.to,
            subject: emailData.subject,
            message: emailData.body
          }
        })
      });

      if (response.ok) {
        console.log('✅ Email enviado via EmailJS');
        return true;
      }
    } catch (emailJsError) {
      console.log('ℹ️ EmailJS não disponível, tentando SMTP direto...');
    }

    // Fallback: usar implementação SMTP nativa mais simples
    try {
      // Criar o corpo do email no formato raw
      const rawEmail = `To: ${emailData.to}\r\nSubject: ${emailData.subject}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${emailData.body}`;
      
      // Usar uma implementação SMTP mais robusta
      const smtpResponse = await fetch('https://smtp.gmail.com:587', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${gmailUser}:${gmailPassword}`)}`,
          'Content-Type': 'text/plain',
        },
        body: rawEmail
      });

      if (smtpResponse.ok) {
        console.log('✅ Email enviado via SMTP direto');
        return true;
      }
    } catch (smtpError) {
      console.log('ℹ️ SMTP direto falhou, usando implementação manual...');
    }

    // Implementação SMTP manual mais robusta
    let conn;
    try {
      conn = await Deno.connect({
        hostname: 'smtp.gmail.com',
        port: 587,
      });

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      let buffer = new Uint8Array(1024);

      // Função helper para ler resposta
      const readResponse = async (): Promise<string> => {
        const bytesRead = await conn.read(buffer);
        return decoder.decode(buffer.subarray(0, bytesRead || 0));
      };

      // Função helper para enviar comando
      const sendCommand = async (command: string): Promise<string> => {
        console.log(`📤 Enviando: ${command}`);
        await conn.write(encoder.encode(command + '\r\n'));
        const response = await readResponse();
        console.log(`📨 Recebido: ${response.trim()}`);
        return response;
      };

      // Sequência SMTP
      console.log('🔗 Conectando ao Gmail SMTP...');
      
      // Aguardar saudação
      const greeting = await readResponse();
      console.log('📨 Saudação:', greeting.trim());

      // EHLO
      await sendCommand(`EHLO ${Deno.env.get('GMAIL_USER')?.split('@')[1] || 'localhost'}`);

      // STARTTLS
      await sendCommand('STARTTLS');

      // Upgrade para TLS
      const tlsConn = await Deno.startTls(conn, { hostname: 'smtp.gmail.com' });
      conn = tlsConn;

      // Re-EHLO após TLS
      await sendCommand(`EHLO ${Deno.env.get('GMAIL_USER')?.split('@')[1] || 'localhost'}`);

      // AUTH LOGIN
      await sendCommand('AUTH LOGIN');
      await sendCommand(btoa(gmailUser));
      await sendCommand(btoa(gmailPassword));

      // MAIL FROM
      await sendCommand(`MAIL FROM: <${gmailUser}>`);

      // RCPT TO
      await sendCommand(`RCPT TO: <${emailData.to}>`);

      // DATA
      await sendCommand('DATA');

      // Enviar corpo do email
      await sendCommand(emailMessage + '\r\n.');

      // QUIT
      await sendCommand('QUIT');

      console.log('✅ Email enviado com sucesso via SMTP manual');
      return true;

    } finally {
      if (conn) {
        try {
          conn.close();
        } catch (e) {
          console.log('ℹ️ Conexão já fechada');
        }
      }
    }

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    // Log mais detalhado do erro
    if (error.name === 'BadResource') {
      console.error('💡 Erro de conexão TCP - possível problema de firewall ou timeout');
    }
    
    return false;
  }
};

const createEmailTemplate = (
  videoTitle: string, 
  videoDescription: string, 
  categories: string[], 
  clientName: string, 
  adminName: string,
  dashboardUrl: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Novo tutorial foi adicionado à sua conta</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🎬 Novo tutorial foi adicionado à sua conta!</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Olá ${clientName}!</p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Um novo vídeo está disponível para você. Clique no botão abaixo e acesse sua dashboard para visualizar.
        </p>
        
        <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
          <h2 style="color: #667eea; margin: 0 0 15px 0; font-size: 22px;">${videoTitle}</h2>
          ${videoDescription ? `<p style="margin: 0 0 15px 0; color: #666; font-size: 16px;">${videoDescription}</p>` : ''}
          
          ${categories.length > 0 ? `
            <div style="margin: 15px 0;">
              <strong style="color: #333;">Categorias:</strong>
              <div style="margin-top: 8px;">
                ${categories.map(category => `
                  <span style="background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; display: inline-block; margin-bottom: 5px;">
                    ${category}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <p style="margin: 15px 0 0 0; color: #888; font-size: 14px;">
            <strong>Adicionado por:</strong> ${adminName}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    text-decoration: none; 
                    padding: 15px 30px; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    display: inline-block;
                    font-size: 16px;">
            Acessar Minha Dashboard
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #888; font-size: 12px; text-align: center; margin: 0;">
          Este email foi enviado automaticamente. Se você não deveria ter recebido esta mensagem, 
          entre em contato conosco em dev@startupsolucoes.com
        </p>
      </div>
    </body>
    </html>
  `;
};

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

    console.log('👤 Buscando nome do administrador...');
    // Buscar nome do administrador
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', adminId)
      .single()

    if (adminError) {
      console.error('❌ Erro ao buscar administrador:', adminError)
      return new Response(
        JSON.stringify({ error: 'Administrador não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminName = admin?.full_name || 'Administrador'
    console.log('✅ Admin encontrado:', adminName);

    let totalEmailsSent = 0;
    let errors = [];

    // URL da dashboard corrigida para o domínio de produção
    const dashboardUrl = 'https://tutoriaiserp.com.br'

    console.log('🔄 Processando clientes selecionados...');
    // Para cada cliente, buscar seus usuários e enviar notificações
    for (const clientId of clientIds) {
      try {
        console.log(`\n👥 Processando cliente: ${clientId}`);
        
        // Buscar dados do cliente (nome e email)
        const { data: client, error: clientError } = await supabaseAdmin
          .from('profiles')
          .select('full_name, email')
          .eq('id', clientId)
          .single()

        if (clientError) {
          console.error(`❌ Erro ao buscar cliente ${clientId}:`, clientError)
          errors.push(`Cliente ${clientId}: ${clientError.message}`)
          continue
        }

        const clientName = client?.full_name || 'Cliente'
        const clientEmail = client?.email
        console.log(`✅ Cliente encontrado: ${clientName} (${clientEmail})`);

        // Array para armazenar todos os emails que receberão a notificação
        const emailsToNotify = [];

        // 1. Adicionar o email do próprio cliente
        if (clientEmail) {
          emailsToNotify.push({
            email: clientEmail,
            type: 'cliente'
          });
          console.log(`📧 Email do cliente adicionado: ${clientEmail}`);
        }

        // 2. Buscar todos os usuários para este cliente
        const { data: clientUsers, error: usersError } = await supabaseAdmin
          .from('client_users')
          .select('user_email')
          .eq('client_id', clientId)

        if (usersError) {
          console.error(`❌ Erro ao buscar usuários para cliente ${clientId}:`, usersError)
          errors.push(`Usuários do cliente ${clientId}: ${usersError.message}`)
        } else if (clientUsers && clientUsers.length > 0) {
          // Adicionar emails dos usuários
          for (const user of clientUsers) {
            emailsToNotify.push({
              email: user.user_email,
              type: 'usuário'
            });
          }
          console.log(`📧 ${clientUsers.length} usuários adicionados à lista de notificações`);
        }

        console.log(`📤 Total de emails para notificar: ${emailsToNotify.length}`);

        // 3. Enviar email para todos na lista
        if (emailsToNotify.length > 0) {
          for (const recipient of emailsToNotify) {
            console.log(`📤 Preparando email para ${recipient.type}: ${recipient.email}`);
            
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
              console.log(`✅ Email enviado para ${recipient.type}: ${recipient.email}`);
            } else {
              console.error(`❌ Falha ao enviar email para ${recipient.type}: ${recipient.email}`);
              errors.push(`Falha ao enviar email para ${recipient.email}`)
            }
          }
        } else {
          console.log(`ℹ️ Nenhum email encontrado para notificar sobre o cliente ${clientName}`);
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
