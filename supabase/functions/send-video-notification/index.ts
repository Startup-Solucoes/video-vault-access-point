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
      console.error('GMAIL_USER:', gmailUser ? 'Configurado' : 'Não configurado');
      console.error('GMAIL_APP_PASSWORD:', gmailPassword ? 'Configurado' : 'Não configurado');
      return false;
    }

    console.log('📧 Enviando email para:', emailData.to);
    console.log('📧 Gmail user:', gmailUser);

    // Configurar conexão SMTP com Gmail
    const smtpConfig = {
      hostname: 'smtp.gmail.com',
      port: 587,
      username: gmailUser,
      password: gmailPassword,
    };

    // Criar o corpo do email no formato SMTP
    const emailMessage = [
      `From: ${gmailUser}`,
      `To: ${emailData.to}`,
      `Subject: ${emailData.subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      emailData.body
    ].join('\r\n');

    // Fazer conexão SMTP
    const conn = await Deno.connect({
      hostname: smtpConfig.hostname,
      port: smtpConfig.port,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Função para enviar comando e aguardar resposta
    const sendCommand = async (command: string): Promise<string> => {
      await conn.write(encoder.encode(command + '\r\n'));
      const buffer = new Uint8Array(1024);
      const bytesRead = await conn.read(buffer);
      return decoder.decode(buffer.subarray(0, bytesRead || 0));
    };

    // Processo SMTP
    console.log('🔗 Conectando ao Gmail SMTP...');
    
    // Aguardar saudação do servidor
    const greeting = await sendCommand('');
    console.log('📨 Resposta do servidor:', greeting.trim());

    // EHLO
    const ehlo = await sendCommand(`EHLO ${smtpConfig.hostname}`);
    console.log('📨 EHLO response:', ehlo.trim());

    // STARTTLS
    const starttls = await sendCommand('STARTTLS');
    console.log('📨 STARTTLS response:', starttls.trim());

    // Upgrade para TLS
    const tlsConn = await Deno.startTls(conn, { hostname: smtpConfig.hostname });

    // AUTH LOGIN
    const auth = await sendCommand('AUTH LOGIN');
    console.log('📨 AUTH response:', auth.trim());

    // Enviar username (base64)
    const usernameB64 = btoa(smtpConfig.username);
    const userResp = await sendCommand(usernameB64);
    console.log('📨 Username response:', userResp.trim());

    // Enviar password (base64)
    const passwordB64 = btoa(smtpConfig.password);
    const passResp = await sendCommand(passwordB64);
    console.log('📨 Password response:', passResp.trim());

    // MAIL FROM
    const mailFrom = await sendCommand(`MAIL FROM: <${gmailUser}>`);
    console.log('📨 MAIL FROM response:', mailFrom.trim());

    // RCPT TO
    const rcptTo = await sendCommand(`RCPT TO: <${emailData.to}>`);
    console.log('📨 RCPT TO response:', rcptTo.trim());

    // DATA
    const dataCmd = await sendCommand('DATA');
    console.log('📨 DATA response:', dataCmd.trim());

    // Enviar corpo do email
    const emailBody = await sendCommand(emailMessage + '\r\n.');
    console.log('📨 Email body response:', emailBody.trim());

    // QUIT
    await sendCommand('QUIT');
    
    tlsConn.close();
    
    console.log('✅ Email enviado com sucesso para:', emailData.to);
    return true;

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    // Fallback: usar uma API de email mais simples
    try {
      console.log('🔄 Tentando fallback com fetch...');
      
      // Usando uma abordagem mais simples com fetch para Gmail API
      // Nota: Este é um fallback simplificado, em produção considere usar Resend ou SendGrid
      const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('GMAIL_APP_PASSWORD')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: btoa(emailMessage)
        })
      });

      if (response.ok) {
        console.log('✅ Email enviado via fallback');
        return true;
      }
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError);
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
        
        // Buscar nome do cliente
        const { data: client, error: clientError } = await supabaseAdmin
          .from('profiles')
          .select('full_name')
          .eq('id', clientId)
          .single()

        if (clientError) {
          console.error(`❌ Erro ao buscar cliente ${clientId}:`, clientError)
          errors.push(`Cliente ${clientId}: ${clientError.message}`)
          continue
        }

        const clientName = client?.full_name || 'Cliente'
        console.log(`✅ Cliente encontrado: ${clientName}`);

        // Buscar todos os usuários para este cliente
        const { data: clientUsers, error: usersError } = await supabaseAdmin
          .from('client_users')
          .select('user_email')
          .eq('client_id', clientId)

        if (usersError) {
          console.error(`❌ Erro ao buscar usuários para cliente ${clientId}:`, usersError)
          errors.push(`Usuários do cliente ${clientId}: ${usersError.message}`)
          continue
        }

        console.log(`📧 Encontrados ${clientUsers?.length || 0} usuários para cliente ${clientName}`)

        // Enviar email para cada usuário
        if (clientUsers && clientUsers.length > 0) {
          for (const user of clientUsers) {
            console.log(`📤 Preparando email para: ${user.user_email}`);
            
            const emailBody = createEmailTemplate(
              videoTitle, 
              videoDescription || '', 
              categories || [], 
              clientName, 
              adminName,
              dashboardUrl
            )
            
            const emailSent = await sendEmail({
              to: user.user_email,
              subject: `🎬 Novo tutorial foi adicionado à sua conta`,
              body: emailBody
            })

            if (emailSent) {
              totalEmailsSent++
              console.log(`✅ Email enviado para: ${user.user_email}`);
            } else {
              console.error(`❌ Falha ao enviar email para: ${user.user_email}`);
              errors.push(`Falha ao enviar email para ${user.user_email}`)
            }
          }
        } else {
          console.log(`ℹ️ Nenhum usuário encontrado para cliente ${clientName}`);
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
