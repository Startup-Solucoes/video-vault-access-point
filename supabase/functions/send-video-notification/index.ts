
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
      console.error('Gmail credentials not configured');
      return false;
    }

    // Create SMTP connection using Deno's built-in SMTP client
    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        smtp_user: gmailUser,
        smtp_pass: gmailPassword,
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        smtp_tls: true,
        from: gmailUser,
        to: [emailData.to],
        subject: emailData.subject,
        html_body: emailData.body,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send email via SMTP');
      return false;
    }

    console.log(`Email sent successfully to ${emailData.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const createEmailTemplate = (videoTitle: string, videoDescription: string, clientName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Novo Vídeo Disponível</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎬 Novo Vídeo Disponível!</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 18px; margin-bottom: 20px;">Olá!</p>
          
          <p style="font-size: 16px; margin-bottom: 25px;">
            Temos o prazer de informar que um novo vídeo foi adicionado à sua conta <strong>${clientName}</strong>:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
            <h2 style="color: #667eea; margin: 0 0 10px 0; font-size: 20px;">${videoTitle}</h2>
            ${videoDescription ? `<p style="margin: 0; color: #666; font-size: 14px;">${videoDescription}</p>` : ''}
          </div>
          
          <p style="font-size: 16px; margin: 25px 0;">
            Faça login em sua conta para assistir ao novo conteúdo e aproveitar todo o material disponível.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://rgdrbimchwxbfyourqgy.supabase.co" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      text-decoration: none; 
                      padding: 15px 30px; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;">
              Acessar Plataforma
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px; text-align: center; margin: 0;">
            Este email foi enviado automaticamente. Se você não deveria ter recebido esta mensagem, 
            entre em contato conosco em dev@startupsolucoes.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
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

    const { videoTitle, videoDescription, clientIds } = await req.json()

    if (!videoTitle || !clientIds || !Array.isArray(clientIds)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: videoTitle, clientIds' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Sending video notifications for clients:', clientIds)

    let totalEmailsSent = 0;
    let errors = [];

    // For each client, get their users and send notifications
    for (const clientId of clientIds) {
      try {
        // Get client name
        const { data: client, error: clientError } = await supabaseAdmin
          .from('profiles')
          .select('full_name')
          .eq('id', clientId)
          .single()

        if (clientError) {
          console.error(`Error fetching client ${clientId}:`, clientError)
          errors.push(`Client ${clientId}: ${clientError.message}`)
          continue
        }

        const clientName = client?.full_name || 'Cliente'

        // Get all users for this client
        const { data: clientUsers, error: usersError } = await supabaseAdmin
          .from('client_users')
          .select('user_email')
          .eq('client_id', clientId)

        if (usersError) {
          console.error(`Error fetching users for client ${clientId}:`, usersError)
          errors.push(`Client ${clientId} users: ${usersError.message}`)
          continue
        }

        console.log(`Found ${clientUsers?.length || 0} users for client ${clientName}`)

        // Send email to each user
        if (clientUsers && clientUsers.length > 0) {
          for (const user of clientUsers) {
            const emailBody = createEmailTemplate(videoTitle, videoDescription || '', clientName)
            
            const emailSent = await sendEmail({
              to: user.user_email,
              subject: `Novo vídeo disponível: ${videoTitle}`,
              body: emailBody
            })

            if (emailSent) {
              totalEmailsSent++
            } else {
              errors.push(`Failed to send email to ${user.user_email}`)
            }
          }
        }
      } catch (error) {
        console.error(`Error processing client ${clientId}:`, error)
        errors.push(`Client ${clientId}: ${error.message}`)
      }
    }

    const response = {
      success: true,
      emailsSent: totalEmailsSent,
      errors: errors.length > 0 ? errors : undefined
    }

    console.log('Email notification summary:', response)

    return new Response(
      JSON.stringify(response),
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
