
#!/bin/bash

TIMESTAMP=$1

echo "Iniciando deploy com timestamp: $TIMESTAMP"

# Parar nginx
echo "Parando Nginx..."
sudo systemctl stop nginx

# Fazer backup
if [ -d "dist" ]; then
  BACKUP_DIR="dist_backup_$(date +%Y%m%d_%H%M%S)"
  sudo cp -r dist "$BACKUP_DIR"
  echo "Backup criado: $BACKUP_DIR"
fi

# Remover dist antigo
sudo rm -rf dist/
echo "Diretorio dist removido"

# Extrair novos arquivos
echo "Extraindo novos arquivos..."
sudo tar -xzf /tmp/deploy.tar.gz

echo "Conteudo APOS a extracao:"
ls -la dist/ 2>/dev/null || echo "ERRO: Diretorio dist nao foi criado!"

if [ -f "dist/index.html" ]; then
  echo "NOVO index.html (primeiras 20 linhas):"
  head -20 dist/index.html
  echo ""
  echo "Verificando 'Tutoriais ERP' no NOVO arquivo:"
  grep -n "Tutoriais ERP" dist/index.html || echo "Texto nao encontrado no novo arquivo!"
  echo ""
  echo "Tamanho do novo index.html:"
  du -h dist/index.html
else
  echo "ERRO CRITICO: index.html nao foi criado!"
  exit 1
fi

# Verificar arquivos assets
echo "Arquivos assets criados:"
find dist/assets -name "*.js" -o -name "*.css" | head -5

# Definir permissões
sudo chown -R www-data:www-data /var/www/tutoriaiserp.com.br
sudo chmod -R 755 /var/www/tutoriaiserp.com.br
echo "Permissoes definidas"

# Configurar Nginx
source /tmp/deploy-scripts/nginx-config.sh $TIMESTAMP

# Testar configuração do Nginx
echo "Testando configuracao do Nginx..."
sudo nginx -t
if [ $? -ne 0 ]; then
  echo "ERRO: Configuracao do Nginx invalida!"
  exit 1
fi

# Reiniciar nginx
echo "Reiniciando Nginx..."
sudo systemctl start nginx
sudo systemctl reload nginx

# Verificar status
echo "Status do Nginx:"
sudo systemctl is-active nginx

# Teste final
source /tmp/deploy-scripts/final-test.sh $TIMESTAMP

# Limpar backups antigos
sudo find /var/www/tutoriaiserp.com.br -name "dist_backup_*" -type d | sort | head -n -3 | sudo xargs rm -rf 2>/dev/null || true
