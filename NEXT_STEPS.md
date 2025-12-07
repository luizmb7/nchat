# 🚀 Próximos Passos - Aplicar Migrations

## 📋 Situação Atual

Você tem apenas 1 tabela no banco de dados, mas precisa de 4 tabelas para o sistema funcionar corretamente.

## ✅ Solução Rápida (RECOMENDADO)

### Opção 1: Via Console do EasyPanel

1. Acesse o EasyPanel
2. Vá até o serviço `websocket-server`
3. Clique em **Console** ou **Terminal**
4. Execute:
   ```bash
   npx prisma migrate deploy
   ```

### Opção 2: Via SQL Direto

1. Conecte ao PostgreSQL com seu cliente SQL
2. Execute o conteúdo do arquivo: `prisma/migrations/20251207_init/migration.sql`

## 📚 Documentação Completa

Para mais detalhes e métodos alternativos, consulte:

- **`MIGRATION_GUIDE.md`** - Guia completo com 3 métodos diferentes

## 🔄 Depois de Aplicar as Migrations

1. Commit e push:

   ```bash
   git add .
   git commit -m "Add database migrations"
   git push origin main
   ```

2. Redeploy no EasyPanel (se necessário)

3. Teste novamente com Postman usando o guia em `docs/POSTMAN_TESTING.md`

## 📊 Tabelas Esperadas

Após aplicar as migrations, você deve ter:

- ✅ `User` - Usuários do chat
- ✅ `Room` - Salas de chat
- ✅ `Message` - Mensagens
- ✅ `_UserRooms` - Relacionamento usuários ↔ salas

## 💡 Automatizar (Opcional)

Para aplicar migrations automaticamente em cada deploy:

1. No EasyPanel: **Settings** → **Advanced**
2. Em **Pre Deploy Command**:
   ```bash
   npx prisma migrate deploy
   ```

---

**Dúvidas?** Consulte `MIGRATION_GUIDE.md` para instruções detalhadas!
