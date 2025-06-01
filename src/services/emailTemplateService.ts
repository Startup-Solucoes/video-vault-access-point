
export interface VideoNotificationEmailData {
  videoTitle: string;
  videoDescription?: string;
  categories: string[];
  adminName: string;
  clientName: string;
  dashboardUrl: string;
}

export interface ClientConfirmationEmailData {
  clientName: string;
  email: string;
  confirmationUrl: string;
}

export const createVideoNotificationTemplate = (data: VideoNotificationEmailData) => {
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
        <p style="font-size: 18px; margin-bottom: 20px;">Olá ${data.clientName}!</p>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Um novo vídeo está disponível para você. Clique no botão abaixo e acesse sua dashboard para visualizar.
        </p>
        
        <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; margin: 25px 0;">
          <h2 style="color: #667eea; margin: 0 0 15px 0; font-size: 22px;">${data.videoTitle}</h2>
          ${data.videoDescription ? `<p style="margin: 0 0 15px 0; color: #666; font-size: 16px;">${data.videoDescription}</p>` : ''}
          
          ${data.categories.length > 0 ? `
            <div style="margin: 15px 0;">
              <strong style="color: #333;">Categorias:</strong>
              <div style="margin-top: 8px;">
                ${data.categories.map(category => `
                  <span style="background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-right: 8px; display: inline-block; margin-bottom: 5px;">
                    ${category}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <p style="margin: 15px 0 0 0; color: #888; font-size: 14px;">
            <strong>Adicionado por:</strong> ${data.adminName}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    text-decoration: none; 
                    padding: 15px 30px; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    display: inline-block;
                    font-size: 16px;
                    transition: transform 0.2s;">
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

export const createClientConfirmationTemplate = (data: ClientConfirmationEmailData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmação de Cadastro - Bem-vindo(a)!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🎉 Bem-vindo(a) à nossa plataforma!</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Olá ${data.clientName}!</p>
        
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
          <a href="${data.confirmationUrl}" 
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
