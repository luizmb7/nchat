# Guia: Aplicar Migrations no Banco de Dados

## 📋 Problema

Você tem apenas uma tabela no banco de dados, mas deveria ter 4 tabelas:

- `User`
- `Room`
- `Message`
- `_UserRooms` (tabela de relacionamento)

## ✅ Solução: 3 Métodos Disponíveis

---

## Método 1: Via Console do EasyPanel (RECOMENDADO)

### Passo 1: Acessar o Console do Servidor

1. No EasyPanel, vá até o serviço `websocket-server`
2. Clique na aba **Console** ou **Terminal**

### Passo 2: Aplicar as Migrations

Execute o seguinte comando:

```bash
npx prisma migrate deploy
```

**Resultado esperado:**

```
Applying migration `20251207_init`
The following migration(s) have been applied:

migrations/
  └─ 20251207_init/
    └─ migration.sql

All migrations have been successfully applied.
```

### Passo 3: Verificar

Execute para ver as tabelas:

```bash
npx prisma db pull
```

Ou conecte novamente com seu cliente SQL e verifique que agora existem 4 tabelas.

---

## Método 2: Via SQL Direto (Alternativa Rápida)

Se preferir executar SQL diretamente:

### Passo 1: Conectar ao PostgreSQL

No EasyPanel, vá até o serviço **postgres** e abra o **Console**.

### Passo 2: Conectar ao Banco

```bash
psql -U postgres -d nchat
```

### Passo 3: Executar o SQL

Copie e cole o conteúdo do arquivo `prisma/migrations/20251207_init/migration.sql`:

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "_UserRooms_B_index" ON "_UserRooms"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Passo 4: Verificar

```sql
\dt
```

Você deve ver as 4 tabelas listadas.

---

## Método 3: Localmente e depois Push (Para Desenvolvimento)

Se você tem acesso ao banco localmente:

### Passo 1: Configurar .env Local

Edite o arquivo `.env` com a URL do banco de produção:

```env
DATABASE_URL="postgresql://user:password@host:5432/nchat?schema=public"
```

### Passo 2: Aplicar Migration

```bash
npx prisma migrate deploy
```

---

## 🔍 Verificação Final

Após aplicar as migrations, verifique com seu cliente SQL:

### Tabelas Esperadas:

1. **User**

   - id (TEXT, PK)
   - username (TEXT, UNIQUE)
   - avatar (TEXT, nullable)
   - createdAt (TIMESTAMP)

2. **Room**

   - id (TEXT, PK)
   - name (TEXT)
   - createdAt (TIMESTAMP)

3. **Message**

   - id (TEXT, PK)
   - content (TEXT)
   - type (TEXT, default: 'text')
   - createdAt (TIMESTAMP)
   - roomId (TEXT, FK → Room.id)
   - userId (TEXT, FK → User.id)

4. **\_UserRooms** (tabela de relacionamento Many-to-Many)
   - A (TEXT, FK → Room.id)
   - B (TEXT, FK → User.id)

---

## ⚠️ Problemas Comuns

### "Tabela já existe"

Se você receber erro de tabela já existente, você tem duas opções:

**Opção A: Limpar o banco (CUIDADO: apaga todos os dados)**

```sql
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "_UserRooms" CASCADE;
DROP TABLE IF EXISTS "Room" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
```

Depois execute a migration novamente.

**Opção B: Criar apenas as tabelas faltantes**

Identifique quais tabelas faltam e execute apenas os comandos CREATE TABLE correspondentes.

---

## 🚀 Próximos Passos

Após aplicar as migrations:

1. ✅ Commit e push das migrations:

   ```bash
   git add prisma/migrations/
   git commit -m "Add initial database migration"
   git push origin main
   ```

2. ✅ Redeploy no EasyPanel (se necessário)

3. ✅ Testar o servidor novamente com Postman

---

## 💡 Dica: Automatizar Migrations no Deploy

Para que as migrations sejam aplicadas automaticamente em cada deploy:

1. No EasyPanel, vá em **Settings** → **Advanced**
2. Em **Pre Deploy Command**, adicione:
   ```bash
   npx prisma migrate deploy
   ```
3. Salve

Agora, toda vez que você fizer deploy, as migrations serão aplicadas automaticamente!
