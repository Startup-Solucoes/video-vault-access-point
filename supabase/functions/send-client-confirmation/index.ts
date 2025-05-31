
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from "npm:nodemailer@6.9.7"

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

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword
      }
    });

    // Send email
    const result = await transporter.sendMail({
      from: gmailUser,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.body
    });

    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const createClientConfirmationTemplate = (clientName: string, confirmationUrl: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmação de Cadastro - Bem-vindo!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Bem-vindo à nossa plataforma!</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Olá ${clientName}!</p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Seu cadastro foi realizado com sucesso! Para completar o processo e ter acesso à plataforma, 
          é necessário confirmar seu email clicando no botão abaixo.
        </p>
        
        <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
          <h3 style="color: #667eea; margin: 0 0 10px 0;">Próximos passos:</h3>
          <ol style="color: #666; padding-left: 20px;">
            <li>Confirme seu email clicando no botão abaixo</li>
            <li>Aguarde a aprovação do seu cadastro por um administrador</li>
            <li>Você receberá um email quando sua conta for aprovada</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    text-decoration: none; 
                    padding: 15px 30px; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    display: inline-block;
                    font-size: 16px;">
            Confirmar Email
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #888; font-size: 12px; text-align: center; margin: 0;">
          Este email foi enviado automaticamente. Se você não se cadastrou em nossa plataforma, 
          entre em contato conosco em dev@startupsolucoes.com
        </p>
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
    const { clientName, clientEmail } = await req.json()

    if (!clientName || !clientEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: clientName, clientEmail' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Sending client confirmation email to:', clientEmail)

    // Create confirmation URL (you may need to adjust this based on your app's URL structure)
    const confirmationUrl = 'https://rgdrbimchwxbfyourqgy.supabase.co'

    const emailBody = createClientConfirmationTemplate(clientName, confirmationUrl)
    
    const emailSent = await sendEmail({
      to: clientEmail,
      subject: 'Confirmação de Cadastro - Bem-vindo!',
      body: emailBody
    })

    if (!emailSent) {
      throw new Error('Failed to send confirmation email')
    }

    const response = {
      success: true,
      message: 'Confirmation email sent successfully'
    }

    console.log('Client confirmation email sent successfully')

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
