
#!/bin/bash

TIMESTAMP=$1

echo "=== TESTE FINAL - DEPLOY $TIMESTAMP ==="
echo "Data/Hora: $(date)"

# 1. Verificar se o Nginx está rodando
echo "1. Verificando status do Nginx..."
NGINX_STATUS=$(sudo systemctl is-active nginx)
echo "Status Nginx: $NGINX_STATUS"

if [ "$NGINX_STATUS" != "active" ]; then
    echo "❌ ERRO: Nginx não está ativo!"
    exit 1
fi

# 2. Testar conectividade básica
echo "2. Testando conectividade básica..."

# Testar domínio principal
echo "2a. Testando domínio principal (tutoriais.consultoriabling.com.br)..."
PRIMARY_HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -I https://tutoriais.consultoriabling.com.br/ --connect-timeout 10 --max-time 30)
echo "Status HTTP domínio principal: $PRIMARY_HTTP_STATUS"

if [ "$PRIMARY_HTTP_STATUS" = "200" ]; then
    echo "✅ Domínio principal acessível"
else
    echo "❌ Problema no domínio principal (Status: $PRIMARY_HTTP_STATUS)"
fi

# Testar redirecionamento do domínio secundário
echo "2b. Testando redirecionamento do domínio secundário..."
SECONDARY_HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -I https://tutoriaiserp.com.br/ --connect-timeout 10 --max-time 30)
echo "Status HTTP domínio secundário: $SECONDARY_HTTP_STATUS"

if [ "$SECONDARY_HTTP_STATUS" = "301" ] || [ "$SECONDARY_HTTP_STATUS" = "302" ] || [ "$SECONDARY_HTTP_STATUS" = "200" ]; then
    echo "✅ Domínio secundário acessível"
else
    echo "❌ Problema no domínio secundário (Status: $SECONDARY_HTTP_STATUS)"
fi

# 3. Verificar certificados SSL
echo "3. Verificando certificados SSL..."

# Certificado do domínio principal
echo "3a. Verificando SSL do domínio principal..."
PRIMARY_SSL_INFO=$(echo | timeout 15 openssl s_client -servername tutoriais.consultoriabling.com.br -connect tutoriais.consultoriabling.com.br:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ SSL funcionando para domínio principal"
    echo "Certificado expira: $PRIMARY_SSL_INFO"
else
    echo "❌ Problema no SSL do domínio principal"
fi

# Certificado do domínio secundário (se existir)
echo "3b. Verificando SSL do domínio secundário..."
if [ -f "/etc/letsencrypt/live/tutoriaiserp.com.br/fullchain.pem" ]; then
    SECONDARY_SSL_INFO=$(echo | timeout 15 openssl s_client -servername tutoriaiserp.com.br -connect tutoriaiserp.com.br:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "✅ SSL funcionando para domínio secundário"
        echo "Certificado expira: $SECONDARY_SSL_INFO"
    else
        echo "❌ Problema no SSL do domínio secundário"
    fi
else
    echo "ℹ️ Certificado para domínio secundário não encontrado (pode estar usando o principal)"
fi

# 4. Testar headers de deploy
echo "4. Verificando headers de deploy..."
DEPLOY_HEADER=$(curl -s -I https://tutoriais.consultoriabling.com.br/ | grep -i "X-Deploy-Time" | cut -d' ' -f2- | tr -d '\r\n')
echo "Header X-Deploy-Time: $DEPLOY_HEADER"

if [ -n "$DEPLOY_HEADER" ]; then
    echo "✅ Header de deploy presente"
else
    echo "❌ Header de deploy ausente"
fi

# 5. Verificar conteúdo da aplicação
echo "5. Verificando conteúdo da aplicação..."
APP_CONTENT=$(curl -s https://tutoriais.consultoriabling.com.br/ | grep -o "TutoriaisERP\|Tutoriais\|ERP" | head -1)
if [ -n "$APP_CONTENT" ]; then
    echo "✅ Conteúdo da aplicação carregado"
else
    echo "❌ Problema no carregamento do conteúdo"
fi

# 6. Testar funcionalidade de compartilhamento de vídeo
echo "6. Testando URLs de compartilhamento de vídeo..."
# Simular uma URL de vídeo compartilhado
VIDEO_URL_TEST=$(curl -s -o /dev/null -w "%{http_code}" -I "https://tutoriais.consultoriabling.com.br/?video=test-video-id" --connect-timeout 10 --max-time 30)
echo "Status para URL de vídeo compartilhado: $VIDEO_URL_TEST"

if [ "$VIDEO_URL_TEST" = "200" ]; then
    echo "✅ URLs de compartilhamento funcionando"
else
    echo "❌ Problema nas URLs de compartilhamento (Status: $VIDEO_URL_TEST)"
fi

# 7. Verificar logs do Nginx (últimas 10 linhas)
echo "7. Verificando logs recentes do Nginx..."
echo "Últimas entradas do log de acesso:"
sudo tail -5 /var/log/nginx/access.log 2>/dev/null || echo "Log de acesso não encontrado"

echo "Últimas entradas do log de erro:"
sudo tail -5 /var/log/nginx/error.log 2>/dev/null || echo "Log de erro não encontrado"

# 8. Resumo final
echo ""
echo "=== RESUMO FINAL ==="
echo "Deploy Timestamp: $TIMESTAMP"
echo "Nginx Status: $NGINX_STATUS"
echo "Domínio Principal (tutoriais.consultoriabling.com.br): HTTP $PRIMARY_HTTP_STATUS"
echo "Domínio Secundário (tutoriaiserp.com.br): HTTP $SECONDARY_HTTP_STATUS"
echo "SSL Principal: $([ $? -eq 0 ] && echo "✅ OK" || echo "❌ ERRO")"

if [ "$PRIMARY_HTTP_STATUS" = "200" ] && [ "$NGINX_STATUS" = "active" ]; then
    echo ""
    echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "🔗 Acesse: https://tutoriais.consultoriabling.com.br"
    echo "📧 Compartilhamento de vídeos: https://tutoriais.consultoriabling.com.br/?video=VIDEO_ID"
else
    echo ""
    echo "⚠️ DEPLOY CONCLUÍDO COM PROBLEMAS"
    echo "Verifique os logs acima para mais detalhes"
fi

echo "=== FIM DO TESTE FINAL ==="
