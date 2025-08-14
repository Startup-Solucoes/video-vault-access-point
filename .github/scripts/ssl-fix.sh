#!/bin/bash

SERVER_DOMAIN="tutoriaiserp.com.br"
TIMESTAMP=$1

echo "=== INICIANDO CORREÇÃO SSL PARA O SERVIDOR ==="
echo "Domínio do Servidor: $SERVER_DOMAIN"
echo "Timestamp: $TIMESTAMP"

# 1. Verificar status atual do certificado
echo "1. Verificando certificado atual..."

# Verificar certificado do domínio do servidor
if [ -f "/etc/letsencrypt/live/$SERVER_DOMAIN/fullchain.pem" ]; then
    echo "Certificado encontrado para $SERVER_DOMAIN. Verificando validade..."
    CERT_EXPIRY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$SERVER_DOMAIN/fullchain.pem | cut -d= -f2)
    echo "Certificado $SERVER_DOMAIN expira em: $CERT_EXPIRY"
    
    if sudo openssl x509 -checkend 2592000 -noout -in /etc/letsencrypt/live/$SERVER_DOMAIN/fullchain.pem; then
        echo "Certificado $SERVER_DOMAIN ainda válido por mais de 30 dias."
    else
        echo "ATENÇÃO: Certificado $SERVER_DOMAIN expira em menos de 30 dias ou já expirou!"
    fi
else
    echo "AVISO: Certificado não encontrado para $SERVER_DOMAIN"
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

# 4. Renovar certificado do servidor (apenas se necessário)
echo "4. Verificando necessidade de renovacao..."

SERVER_NEEDS_RENEWAL=false

# Verificar se o domínio do servidor precisa de renovação
if [ -f "/etc/letsencrypt/live/$SERVER_DOMAIN/fullchain.pem" ]; then
    if ! sudo openssl x509 -checkend 2592000 -noout -in /etc/letsencrypt/live/$SERVER_DOMAIN/fullchain.pem; then
        SERVER_NEEDS_RENEWAL=true
        echo "Dominio do servidor precisa de renovacao"
    else
        echo "Dominio do servidor ja tem certificado valido"
    fi
else
    SERVER_NEEDS_RENEWAL=true
    echo "Certificado nao encontrado para dominio do servidor"
fi

# Renovar apenas se necessário
if [ "$SERVER_NEEDS_RENEWAL" = true ]; then
    echo "4a. Renovando certificado para $SERVER_DOMAIN..."
    sudo certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email admin@$SERVER_DOMAIN \
        --domains $SERVER_DOMAIN,www.$SERVER_DOMAIN \
        --force-renewal
    SERVER_CERTBOT_EXIT_CODE=$?
else
    echo "4a. Pulando renovacao para $SERVER_DOMAIN (certificado valido)"
    SERVER_CERTBOT_EXIT_CODE=0
fi

# Verificar resultado
if [ $SERVER_CERTBOT_EXIT_CODE -eq 0 ]; then
    echo "✅ Certificado para $SERVER_DOMAIN renovado com sucesso!"
else
    echo "❌ Erro na renovação do certificado para $SERVER_DOMAIN (código: $SERVER_CERTBOT_EXIT_CODE)"
    
    # Tentar método alternativo
    echo "Tentando método alternativo..."
    
    sudo mkdir -p /var/www/html/.well-known/acme-challenge
    sudo chown -R www-data:www-data /var/www/html
    
    sudo certbot certonly \
        --webroot \
        --webroot-path=/var/www/html \
        --non-interactive \
        --agree-tos \
        --email admin@$SERVER_DOMAIN \
        --domains $SERVER_DOMAIN,www.$SERVER_DOMAIN \
        --force-renewal
fi

# 5. Verificar certificado após renovação
echo "5. Verificando certificado renovado..."

if [ -f "/etc/letsencrypt/live/$SERVER_DOMAIN/fullchain.pem" ]; then
    NEW_CERT_EXPIRY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$SERVER_DOMAIN/fullchain.pem | cut -d= -f2)
    echo "✅ Novo certificado para $SERVER_DOMAIN expira em: $NEW_CERT_EXPIRY"
else
    echo "❌ Certificado para $SERVER_DOMAIN ainda não encontrado após renovação!"
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

# 9. Teste SSL do servidor
echo "9. Testando SSL do servidor..."
sleep 5

echo "9a. Testando SSL para $SERVER_DOMAIN..."
SSL_TEST=$(echo | timeout 10 openssl s_client -servername $SERVER_DOMAIN -connect $SERVER_DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ SSL funcionando corretamente para $SERVER_DOMAIN!"
    echo "$SSL_TEST"
else
    echo "❌ Problema no teste SSL para $SERVER_DOMAIN"
fi

echo "=== CORREÇÃO SSL CONCLUÍDA ==="