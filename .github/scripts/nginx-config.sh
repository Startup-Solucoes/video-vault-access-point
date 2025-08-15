
#!/bin/bash

TIMESTAMP=$1

echo "Configurando Nginx com timestamp: $TIMESTAMP"

sudo tee /etc/nginx/sites-available/tutoriais.consultoriabling.com.br > /dev/null <<NGINX_EOF
# Redirecionamento HTTP para HTTPS - Domínio Principal
server {
    listen 80;
    listen [::]:80;
    server_name tutoriais.consultoriabling.com.br www.tutoriais.consultoriabling.com.br;
    return 301 https://tutoriais.consultoriabling.com.br\$request_uri;
}

# Redirecionamento HTTP para HTTPS - Domínio Secundário 
server {
    listen 80;
    listen [::]:80;
    server_name tutoriaiserp.com.br www.tutoriaiserp.com.br;
    return 301 https://tutoriais.consultoriabling.com.br\$request_uri;
}

# Servidor principal - tutoriaiserp.com.br
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tutoriaiserp.com.br www.tutoriaiserp.com.br;

    ssl_certificate /etc/letsencrypt/live/tutoriaiserp.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tutoriaiserp.com.br/privkey.pem;

    # Configurações SSL melhoradas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    root /var/www/tutoriaiserp.com.br/dist;
    index index.html;

    # Anti-cache headers com timestamp
    add_header X-Deploy-Time "$TIMESTAMP" always;
    add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0" always;
    add_header Pragma "no-cache" always;
    add_header Expires "Thu, 01 Jan 1970 00:00:00 GMT" always;

    # Cabeçalhos de segurança com HTTPS forçado
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; connect-src 'self' https: wss:; font-src 'self' https:; frame-src 'self' https:; media-src 'self' https:; object-src 'none'; base-uri 'self'; upgrade-insecure-requests;" always;

    location / {
        try_files \$uri \$uri/ /index.html;
        
        add_header X-Deploy-Time "$TIMESTAMP" always;
        add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0" always;
        add_header Pragma "no-cache" always;
        add_header Expires "Thu, 01 Jan 1970 00:00:00 GMT" always;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        add_header X-Deploy-Time "$TIMESTAMP" always;
        add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0" always;
        add_header Pragma "no-cache" always;
        add_header Expires "Thu, 01 Jan 1970 00:00:00 GMT" always;
    }


    # Redirecionamento especial para links de vídeos
    location ~ ^/.*[?&]video=([a-f0-9-]+) {
        try_files \$uri \$uri/ /index.html;
        
        add_header X-Deploy-Time "$TIMESTAMP" always;
        add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0" always;
        add_header Pragma "no-cache" always;
        add_header Expires "Thu, 01 Jan 1970 00:00:00 GMT" always;
    }
}
NGINX_EOF

# Criar link simbólico se não existir
if [ ! -L "/etc/nginx/sites-enabled/tutoriais.consultoriabling.com.br" ]; then
    sudo rm -f /etc/nginx/sites-enabled/tutoriaiserp.com.br
    sudo ln -sf /etc/nginx/sites-available/tutoriais.consultoriabling.com.br /etc/nginx/sites-enabled/
fi

echo "Configuração do Nginx criada"
