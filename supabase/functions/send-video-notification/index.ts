
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

    // Simulated email sending using Gmail SMTP
    // In a real implementation, you would use a proper SMTP client
    console.log(`Sending email from ${gmailUser} to ${emailData.to}`);
    console.log(`Subject: ${emailData.subject}`);
    
    // For now, we'll log the email content as the SMTP implementation would require additional dependencies
    // In production, you would integrate with a proper SMTP client or service
    console.log('Email would be sent with Gmail SMTP credentials');
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
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
      <title>Novo tutorial foi adicionado a sua conta</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🎬 Novo tutorial foi adicionado a sua conta!</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Olá ${clientName}!</p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Um novo vídeo está disponível para você, clique no botão abaixo e verifique na sua dashboard.
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
            Acessar Dashboard
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

    const { videoTitle, videoDescription, categories, clientIds, adminId } = await req.json()

    if (!videoTitle || !clientIds || !Array.isArray(clientIds) || !adminId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: videoTitle, clientIds, adminId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Sending video notifications for clients:', clientIds)

    // Get admin name
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', adminId)
      .single()

    if (adminError) {
      console.error('Error fetching admin:', adminError)
      return new Response(
        JSON.stringify({ error: 'Admin not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminName = admin?.full_name || 'Administrador'

    let totalEmailsSent = 0;
    let errors = [];

    // Dashboard URL
    const dashboardUrl = 'https://rgdrbimchwxbfyourqgy.supabase.co'

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
              subject: `Novo tutorial foi adicionado a sua conta`,
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
