
#!/bin/bash

TIMESTAMP=$1

echo "Testando resposta do site..."
sleep 3
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://tutoriaiserp.com.br/ --max-time 10)
echo "Codigo de resposta HTTP: $RESPONSE"

if [ "$RESPONSE" = "200" ]; then
  echo "Site respondendo corretamente!"
  
  # Verificar se o conteúdo está correto
  echo "Verificando conteudo da resposta..."
  CONTENT=$(curl -s https://tutoriaiserp.com.br/ --max-time 10)
  if echo "$CONTENT" | grep -q "TutoriaisERP"; then
    echo "SUCESSO: 'TutoriaisERP' encontrado na resposta do site!"
  else
    echo "PROBLEMA: 'TutoriaisERP' NAO encontrado na resposta do site!"
    echo "Primeiras 500 chars da resposta:"
    echo "$CONTENT" | head -c 500
  fi
else
  echo "Site nao esta respondendo corretamente (codigo: $RESPONSE)"
fi
