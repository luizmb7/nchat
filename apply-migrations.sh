#!/bin/bash

# Script para aplicar migrations do Prisma
# Uso: ./apply-migrations.sh

echo "🔄 Aplicando migrations do Prisma..."
echo ""

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Erro: Arquivo .env não encontrado!"
    echo "Por favor, configure o arquivo .env com a DATABASE_URL"
    exit 1
fi

# Aplica as migrations
npx prisma migrate deploy

# Verifica o resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migrations aplicadas com sucesso!"
    echo ""
    echo "📊 Verificando o banco de dados..."
    npx prisma db pull --force
    echo ""
    echo "✅ Banco de dados sincronizado!"
else
    echo ""
    echo "❌ Erro ao aplicar migrations!"
    echo "Verifique a DATABASE_URL no arquivo .env"
    exit 1
fi
