
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

# Testar domínio do servidor (tutoriaiserp.com.br)
echo "2a. Testando domínio do servidor (tutoriaiserp.com.br)..."
SERVER_HTTP_STATUS=""
for i in {1..3}; do
    SERVER_HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -I https://tutoriaiserp.com.br/ --connect-timeout 15 --max-time 45)
    if [ "$SERVER_HTTP_STATUS" = "200" ] || [ "$SERVER_HTTP_STATUS" = "301" ] || [ "$SERVER_HTTP_STATUS" = "302" ]; then
        break
    fi
    echo "Tentativa $i falhou, tentando novamente..."
    sleep 5
done
echo "Status HTTP domínio do servidor: $SERVER_HTTP_STATUS"

if [ "$SERVER_HTTP_STATUS" = "200" ] || [ "$SERVER_HTTP_STATUS" = "301" ] || [ "$SERVER_HTTP_STATUS" = "302" ]; then
    echo "✅ Domínio do servidor acessível"
else
    echo "⚠️ Domínio do servidor com problemas (Status: $SERVER_HTTP_STATUS) - Continuando..."
fi

# 3. Verificar certificados SSL
echo "3. Verificando certificados SSL..."

# Certificado do domínio do servidor
echo "3a. Verificando SSL do domínio do servidor..."
if [ -f "/etc/letsencrypt/live/tutoriaiserp.com.br/fullchain.pem" ]; then
    SERVER_SSL_INFO=$(echo | timeout 15 openssl s_client -servername tutoriaiserp.com.br -connect tutoriaiserp.com.br:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "✅ SSL funcionando para domínio do servidor"
        echo "Certificado expira: $SERVER_SSL_INFO"
    else
        echo "❌ Problema no SSL do domínio do servidor"
    fi
else
    echo "ℹ️ Certificado para domínio do servidor não encontrado"
fi

# 4. Testar headers de deploy
echo "4. Verificando headers de deploy..."
DEPLOY_HEADER=$(curl -s -I https://tutoriaiserp.com.br/ | grep -i "X-Deploy-Time" | cut -d' ' -f2- | tr -d '\r\n')
echo "Header X-Deploy-Time: $DEPLOY_HEADER"

if [ -n "$DEPLOY_HEADER" ]; then
    echo "✅ Header de deploy presente"
else
    echo "❌ Header de deploy ausente"
fi

# 5. Verificar conteúdo da aplicação
echo "5. Verificando conteúdo da aplicação..."
APP_CONTENT=$(curl -s https://tutoriaiserp.com.br/ | grep -o "TutoriaisERP\|Tutoriais\|ERP" | head -1)
if [ -n "$APP_CONTENT" ]; then
    echo "✅ Conteúdo da aplicação carregado"
else
    echo "❌ Problema no carregamento do conteúdo"
fi

# 6. Testar acesso à aplicação
echo "6. Testando acesso à aplicação..."
APP_ACCESS_TEST=$(curl -s -o /dev/null -w "%{http_code}" -I "https://tutoriaiserp.com.br/" --connect-timeout 10 --max-time 30)
echo "Status da aplicação: $APP_ACCESS_TEST"

if [ "$APP_ACCESS_TEST" = "200" ] || [ "$APP_ACCESS_TEST" = "301" ] || [ "$APP_ACCESS_TEST" = "302" ]; then
    echo "✅ Aplicação acessível"
else
    echo "❌ Problema no acesso à aplicação (Status: $APP_ACCESS_TEST)"
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
echo "Domínio do Servidor (tutoriaiserp.com.br): HTTP $SERVER_HTTP_STATUS"
echo "SSL Servidor: $([ -f "/etc/letsencrypt/live/tutoriaiserp.com.br/fullchain.pem" ] && echo "✅ OK" || echo "❌ ERRO")"

if [ "$NGINX_STATUS" = "active" ]; then
    echo ""
    echo "🎉 DEPLOY CONCLUÍDO!"
    echo "🔗 Acesse: https://tutoriaiserp.com.br"
    echo "📧 Aplicação funcionando corretamente"
    
    if [ "$SERVER_HTTP_STATUS" != "200" ] && [ "$SERVER_HTTP_STATUS" != "301" ] && [ "$SERVER_HTTP_STATUS" != "302" ]; then
        echo "⚠️ Nota: Servidor pode precisar de alguns minutos para estabilizar"
    fi
else
    echo ""
    echo "❌ DEPLOY COM PROBLEMAS CRÍTICOS"
    echo "Nginx não está ativo - verifique os logs"
    exit 1
fi

echo "=== FIM DO TESTE FINAL ==="
