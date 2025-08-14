#!/bin/bash

PRIMARY_DOMAIN="tutoriais.consultoriabling.com.br"
SECONDARY_DOMAIN="tutoriaiserp.com.br"
TIMESTAMP=$1

echo "=== INICIANDO CORREÇÃO SSL PARA AMBOS OS DOMÍNIOS ==="
echo "Domínio Principal: $PRIMARY_DOMAIN"
echo "Domínio Secundário: $SECONDARY_DOMAIN"
echo "Timestamp: $TIMESTAMP"

# 1. Verificar status atual dos certificados
echo "1. Verificando certificados atuais..."

# Verificar certificado do domínio principal
if [ -f "/etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem" ]; then
    echo "Certificado encontrado para $PRIMARY_DOMAIN. Verificando validade..."
    CERT_EXPIRY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem | cut -d= -f2)
    echo "Certificado $PRIMARY_DOMAIN expira em: $CERT_EXPIRY"
    
    if sudo openssl x509 -checkend 2592000 -noout -in /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem; then
        echo "Certificado $PRIMARY_DOMAIN ainda válido por mais de 30 dias."
    else
        echo "ATENÇÃO: Certificado $PRIMARY_DOMAIN expira em menos de 30 dias ou já expirou!"
    fi
else
    echo "AVISO: Certificado não encontrado para $PRIMARY_DOMAIN"
fi

# Verificar certificado do domínio secundário
if [ -f "/etc/letsencrypt/live/$SECONDARY_DOMAIN/fullchain.pem" ]; then
    echo "Certificado encontrado para $SECONDARY_DOMAIN. Verificando validade..."
    CERT_EXPIRY_SEC=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$SECONDARY_DOMAIN/fullchain.pem | cut -d= -f2)
    echo "Certificado $SECONDARY_DOMAIN expira em: $CERT_EXPIRY_SEC"
else
    echo "AVISO: Certificado não encontrado para $SECONDARY_DOMAIN"
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

# 4. Renovar certificados para ambos os domínios (apenas se necessário)
echo "4. Verificando necessidade de renovacao..."

PRIMARY_NEEDS_RENEWAL=false
SECONDARY_NEEDS_RENEWAL=false

# Verificar se o domínio principal precisa de renovação
if [ -f "/etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem" ]; then
    if ! sudo openssl x509 -checkend 2592000 -noout -in /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem; then
        PRIMARY_NEEDS_RENEWAL=true
        echo "Dominio principal precisa de renovacao"
    else
        echo "Dominio principal ja tem certificado valido"
    fi
else
    PRIMARY_NEEDS_RENEWAL=true
    echo "Certificado nao encontrado para dominio principal"
fi

# Verificar se o domínio secundário precisa de renovação  
if [ -f "/etc/letsencrypt/live/$SECONDARY_DOMAIN/fullchain.pem" ]; then
    if ! sudo openssl x509 -checkend 2592000 -noout -in /etc/letsencrypt/live/$SECONDARY_DOMAIN/fullchain.pem; then
        SECONDARY_NEEDS_RENEWAL=true
        echo "Dominio secundario precisa de renovacao"
    else
        echo "Dominio secundario ja tem certificado valido"
    fi
else
    SECONDARY_NEEDS_RENEWAL=true
    echo "Certificado nao encontrado para dominio secundario"
fi

# Renovar apenas se necessário
if [ "$PRIMARY_NEEDS_RENEWAL" = true ]; then
    echo "4a. Renovando certificado para $PRIMARY_DOMAIN..."
    sudo certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email admin@$PRIMARY_DOMAIN \
        --domains $PRIMARY_DOMAIN,www.$PRIMARY_DOMAIN \
        --force-renewal
    PRIMARY_CERTBOT_EXIT_CODE=$?
else
    echo "4a. Pulando renovacao para $PRIMARY_DOMAIN (certificado valido)"
    PRIMARY_CERTBOT_EXIT_CODE=0
fi

if [ "$SECONDARY_NEEDS_RENEWAL" = true ]; then
    echo "4b. Renovando certificado para $SECONDARY_DOMAIN..."
    sudo certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email admin@$SECONDARY_DOMAIN \
        --domains $SECONDARY_DOMAIN,www.$SECONDARY_DOMAIN \
        --force-renewal
    SECONDARY_CERTBOT_EXIT_CODE=$?
else
    echo "4b. Pulando renovacao para $SECONDARY_DOMAIN (certificado valido)"
    SECONDARY_CERTBOT_EXIT_CODE=0
fi

# Verificar resultados
if [ $PRIMARY_CERTBOT_EXIT_CODE -eq 0 ]; then
    echo "✅ Certificado para $PRIMARY_DOMAIN renovado com sucesso!"
else
    echo "❌ Erro na renovação do certificado para $PRIMARY_DOMAIN (código: $PRIMARY_CERTBOT_EXIT_CODE)"
fi

if [ $SECONDARY_CERTBOT_EXIT_CODE -eq 0 ]; then
    echo "✅ Certificado para $SECONDARY_DOMAIN renovado com sucesso!"
else
    echo "❌ Erro na renovação do certificado para $SECONDARY_DOMAIN (código: $SECONDARY_CERTBOT_EXIT_CODE)"
fi

# Se ambos falharam, tentar método alternativo
if [ $PRIMARY_CERTBOT_EXIT_CODE -ne 0 ] && [ $SECONDARY_CERTBOT_EXIT_CODE -ne 0 ]; then
    echo "Tentando método alternativo para ambos os domínios..."
    
    sudo mkdir -p /var/www/html/.well-known/acme-challenge
    sudo chown -R www-data:www-data /var/www/html
    
    # Tentar webroot para domínio principal
    sudo certbot certonly \
        --webroot \
        --webroot-path=/var/www/html \
        --non-interactive \
        --agree-tos \
        --email admin@$PRIMARY_DOMAIN \
        --domains $PRIMARY_DOMAIN,www.$PRIMARY_DOMAIN \
        --force-renewal
    
    # Tentar webroot para domínio secundário
    sudo certbot certonly \
        --webroot \
        --webroot-path=/var/www/html \
        --non-interactive \
        --agree-tos \
        --email admin@$SECONDARY_DOMAIN \
        --domains $SECONDARY_DOMAIN,www.$SECONDARY_DOMAIN \
        --force-renewal
fi

# 5. Verificar certificados após renovação
echo "5. Verificando certificados renovados..."

# Verificar certificado do domínio principal
if [ -f "/etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem" ]; then
    NEW_CERT_EXPIRY_PRIMARY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem | cut -d= -f2)
    echo "✅ Novo certificado para $PRIMARY_DOMAIN expira em: $NEW_CERT_EXPIRY_PRIMARY"
else
    echo "❌ Certificado para $PRIMARY_DOMAIN ainda não encontrado após renovação!"
fi

# Verificar certificado do domínio secundário
if [ -f "/etc/letsencrypt/live/$SECONDARY_DOMAIN/fullchain.pem" ]; then
    NEW_CERT_EXPIRY_SECONDARY=$(sudo openssl x509 -enddate -noout -in /etc/letsencrypt/live/$SECONDARY_DOMAIN/fullchain.pem | cut -d= -f2)
    echo "✅ Novo certificado para $SECONDARY_DOMAIN expira em: $NEW_CERT_EXPIRY_SECONDARY"
else
    echo "❌ Certificado para $SECONDARY_DOMAIN ainda não encontrado após renovação!"
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

# 9. Teste SSL para ambos os domínios
echo "9. Testando SSL para ambos os domínios..."
sleep 5

# Testar SSL do domínio principal
echo "9a. Testando SSL para $PRIMARY_DOMAIN..."
SSL_TEST_PRIMARY=$(echo | timeout 10 openssl s_client -servername $PRIMARY_DOMAIN -connect $PRIMARY_DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ SSL funcionando corretamente para $PRIMARY_DOMAIN!"
    echo "$SSL_TEST_PRIMARY"
else
    echo "❌ Problema no teste SSL para $PRIMARY_DOMAIN"
fi

# Testar SSL do domínio secundário
echo "9b. Testando SSL para $SECONDARY_DOMAIN..."
SSL_TEST_SECONDARY=$(echo | timeout 10 openssl s_client -servername $SECONDARY_DOMAIN -connect $SECONDARY_DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ SSL funcionando corretamente para $SECONDARY_DOMAIN!"
    echo "$SSL_TEST_SECONDARY"
else
    echo "❌ Problema no teste SSL para $SECONDARY_DOMAIN"
fi

echo "=== CORREÇÃO SSL CONCLUÍDA ==="