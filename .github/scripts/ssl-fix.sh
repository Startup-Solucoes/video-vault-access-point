#!/bin/bash

DOMAIN="tutoriaiserp.com.br"
TIMESTAMP=$1

echo "=== INICIANDO CORREÇÃO SSL PARA $DOMAIN ==="
echo "Timestamp: $TIMESTAMP"

# 1. Verificar status atual do certificado
echo "1. Verificando certificado atual..."
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "Certificado encontrado. Verificando validade..."
    CERT_EXPIRY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem | cut -d= -f2)
    echo "Certificado expira em: $CERT_EXPIRY"
    
    # Verificar se expira em menos de 30 dias
    if sudo openssl x509 -checkend 2592000 -noout -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem; then
        echo "Certificado ainda válido por mais de 30 dias."
    else
        echo "ATENÇÃO: Certificado expira em menos de 30 dias ou já expirou!"
    fi
else
    echo "ERRO: Certificado não encontrado em /etc/letsencrypt/live/$DOMAIN/"
fi

# 2. Verificar se Certbot está instalado
echo "2. Verificando Certbot..."
if command -v certbot &> /dev/null; then
    echo "Certbot instalado: $(certbot --version)"
else
    echo "Certbot não encontrado. Instalando..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# 3. Parar Nginx temporariamente
echo "3. Parando Nginx para renovação..."
sudo systemctl stop nginx

# 4. Renovar certificado
echo "4. Renovando certificado SSL..."
sudo certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@$DOMAIN \
    --domains $DOMAIN,www.$DOMAIN \
    --force-renewal

CERTBOT_EXIT_CODE=$?

if [ $CERTBOT_EXIT_CODE -eq 0 ]; then
    echo "✅ Certificado renovado com sucesso!"
else
    echo "❌ Erro na renovação do certificado (código: $CERTBOT_EXIT_CODE)"
    echo "Tentando método alternativo..."
    
    # Método alternativo usando webroot
    sudo mkdir -p /var/www/html/.well-known/acme-challenge
    sudo chown -R www-data:www-data /var/www/html
    
    sudo certbot certonly \
        --webroot \
        --webroot-path=/var/www/html \
        --non-interactive \
        --agree-tos \
        --email admin@$DOMAIN \
        --domains $DOMAIN,www.$DOMAIN \
        --force-renewal
fi

# 5. Verificar certificado após renovação
echo "5. Verificando certificado renovado..."
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    NEW_CERT_EXPIRY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem | cut -d= -f2)
    echo "✅ Novo certificado expira em: $NEW_CERT_EXPIRY"
else
    echo "❌ Certificado ainda não encontrado após renovação!"
fi

# 6. Configurar renovação automática
echo "6. Configurando renovação automática..."
CRON_ENTRY="0 12 * * * /usr/bin/certbot renew --quiet && /usr/bin/systemctl reload nginx"

# Remover entradas antigas e adicionar nova
sudo crontab -l 2>/dev/null | grep -v "certbot renew" | sudo crontab -
echo "$CRON_ENTRY" | sudo crontab -

echo "✅ Renovação automática configurada (todos os dias às 12h)"

# 7. Reiniciar Nginx
echo "7. Reiniciando Nginx..."
sudo systemctl start nginx
sudo systemctl reload nginx

# 8. Verificar status do serviço
echo "8. Verificando status dos serviços..."
echo "Nginx: $(sudo systemctl is-active nginx)"

# 9. Teste SSL
echo "9. Testando SSL..."
sleep 5

SSL_TEST=$(echo | timeout 10 openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ SSL funcionando corretamente!"
    echo "$SSL_TEST"
else
    echo "❌ Problema no teste SSL"
fi

echo "=== CORREÇÃO SSL CONCLUÍDA ==="