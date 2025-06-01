
#!/bin/bash

TIMESTAMP=$1

echo "Configurando Nginx com timestamp: $TIMESTAMP"

sudo tee /etc/nginx/sites-available/tutoriaiserp.com.br > /dev/null <<NGINX_EOF
server {
    listen 80;
    listen [::]:80;
    server_name tutoriaiserp.com.br www.tutoriaiserp.com.br;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tutoriaiserp.com.br www.tutoriaiserp.com.br;

    ssl_certificate /etc/letsencrypt/live/tutoriaiserp.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tutoriaiserp.com.br/privkey.pem;

    root /var/www/tutoriaiserp.com.br/dist;
    index index.html;

    # Anti-cache headers com timestamp
    add_header X-Deploy-Time "$TIMESTAMP" always;
    add_header Cache-Control "no-cache, no-store, must-revalidate, max-age=0" always;
    add_header Pragma "no-cache" always;
    add_header Expires "Thu, 01 Jan 1970 00:00:00 GMT" always;

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
}
NGINX_EOF

echo "Configuração do Nginx criada"
