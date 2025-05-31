
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const gmailUser = Deno.env.get('GMAIL_USER')
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD')

    if (!supabaseUrl || !serviceRoleKey || !gmailUser || !gmailPassword) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { clientId, clientEmail, clientName, adminId } = await req.json()

    if (!clientId || !clientEmail || !clientName || !adminId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get admin info
    const { data: admin, error: adminError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', adminId)
      .single()

    if (adminError || !admin) {
      console.error('Error fetching admin info:', adminError)
      return new Response(
        JSON.stringify({ error: 'Admin not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const createClientConfirmationTemplate = (clientName: string, confirmationUrl: string) => {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirme seu cadastro</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Bem-vindo ao nosso Portal!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #495057; margin-top: 0;">Olá, ${clientName}!</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Seu cadastro foi aprovado com sucesso! Para acessar sua conta e começar a usar nossos serviços, 
              você precisa confirmar seu endereço de e-mail.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block; 
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                ✅ Confirmar E-mail
              </a>
            </div>
            
            <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px;">
                <strong>📌 Importante:</strong> Este link de confirmação expira em 24 horas. 
                Se você não confirmar seu e-mail dentro deste prazo, será necessário solicitar um novo link.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #6c757d; margin-top: 30px; text-align: center;">
              Se você não solicitou este cadastro, pode ignorar este e-mail com segurança.
            </p>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #6c757d; text-align: center; margin: 0;">
              Este é um e-mail automático, não responda a esta mensagem.
            </p>
          </div>
        </body>
        </html>
      `;
    };

    console.log('Sending client confirmation email to:', clientEmail)

    // URL de confirmação que redireciona para a tela de login 
    const appUrl = 'https://2633fcdc-13df-4213-8528-a3784715b929.lovableproject.com' // URL do seu app
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token={confirmation_token}&type=email&redirect_to=${encodeURIComponent(appUrl + '/?type=email')}`

    const emailBody = createClientConfirmationTemplate(clientName, confirmationUrl)
    
    // Send email using nodemailer with Gmail SMTP
    const nodemailerConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: gmailUser,
        pass: gmailPassword
      }
    }

    const emailData = {
      from: `"Portal de Vídeos" <${gmailUser}>`,
      to: clientEmail,
      subject: '✅ Confirme seu cadastro - Portal de Vídeos',
      html: emailBody
    }

    // Call nodemailer to send email
    const nodemailerResponse = await fetch('https://api.nodemailer.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transport: nodemailerConfig,
        message: emailData
      })
    })

    if (!nodemailerResponse.ok) {
      console.error('Failed to send email via nodemailer')
      throw new Error('Failed to send confirmation email')
    }

    console.log('Client confirmation email sent successfully')

    return new Response(
      JSON.stringify({ message: 'Client confirmation email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-client-confirmation function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
