# 🚀 SOLUÇÃO RÁPIDA - Criar Tabelas Agora

## ⚡ Método Mais Rápido (2 minutos)

### Opção A: Via Cliente SQL (TablePlus, DBeaver, pgAdmin, etc)

1. **Abra seu cliente SQL**
2. **Conecte ao banco PostgreSQL do EasyPanel**

   - Host: (do EasyPanel)
   - Port: 5432
   - Database: nchat
   - User: postgres (ou conforme configurado)
   - Password: (do EasyPanel)

3. **Abra o arquivo `create-tables.sql`** deste projeto

4. **Execute o script completo** (Ctrl+Enter ou botão Execute)

5. **Verifique**: Você deve ter 5 tabelas:
   - ✅ User
   - ✅ Room
   - ✅ Message
   - ✅ \_UserRooms
   - ✅ \_prisma_migrations

### Opção B: Via Console do EasyPanel

1. **No EasyPanel**, vá até o serviço **postgres**
2. Clique em **Console**
3. Execute:
   ```bash
   psql -U postgres -d nchat
   ```
4. **Copie e cole** o conteúdo do arquivo `create-tables.sql`
5. Pressione Enter

## ✅ Depois de Criar as Tabelas

1. **Teste o servidor** com Postman:

   - Siga o guia em `docs/POSTMAN_TESTING.md`
   - Tente criar uma sala novamente

2. **Faça rebuild do container** (quando tiver tempo):
   - No EasyPanel: serviço `websocket-server` → **Rebuild**
   - Isso garante que futuras migrations funcionem

## 📁 Arquivos Importantes

- **`create-tables.sql`** ← Execute este arquivo no banco!
- **`docs/POSTMAN_TESTING.md`** ← Guia de testes
- **`MIGRATIONS_NOT_FOUND.md`** ← Explicação detalhada do problema

## 🎯 Resumo

```
1. Abra seu cliente SQL
2. Conecte ao banco do EasyPanel
3. Execute o arquivo create-tables.sql
4. Teste com Postman
5. Pronto! 🎉
```

---

**Dúvida?** Consulte `MIGRATIONS_NOT_FOUND.md` para mais detalhes!
