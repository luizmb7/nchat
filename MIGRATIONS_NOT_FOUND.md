# Solução: Migrations Não Encontradas no Container

## 🔍 Problema

Quando você executou `npx prisma migrate deploy` no container, ele não encontrou as migrations porque:

1. O container foi buildado **antes** de você criar as migrations
2. É necessário fazer um **rebuild** do container

## ✅ Solução 1: Rebuild do Container (RECOMENDADO)

### No EasyPanel:

1. Vá até o serviço `websocket-server`
2. Clique em **Settings** ou **Deploy**
3. Clique em **Rebuild** (ou force um novo deploy)
4. Aguarde o build completar
5. Depois execute novamente:
   ```bash
   npx prisma migrate deploy
   ```

## ✅ Solução 2: Aplicar SQL Diretamente (Mais Rápido)

Se você quiser resolver agora sem esperar rebuild:

### Passo 1: Conectar ao PostgreSQL

No EasyPanel, vá até o serviço **postgres** e abra o **Console**.

### Passo 2: Conectar ao Banco

```bash
psql -U postgres -d nchat
```

(Ou use as credenciais que você configurou)

### Passo 3: Verificar Tabelas Existentes

```sql
\dt
```

### Passo 4: Executar o SQL de Criação

Copie e cole este SQL completo:

```sql
-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "_UserRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "_UserRooms_B_index" ON "_UserRooms"("B");

-- AddForeignKey (só se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Message_roomId_fkey'
    ) THEN
        ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey"
        FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Message_userId_fkey'
    ) THEN
        ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_UserRooms_A_fkey'
    ) THEN
        ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_A_fkey"
        FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_UserRooms_B_fkey'
    ) THEN
        ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_B_fkey"
        FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
```

### Passo 5: Verificar

```sql
\dt
```

Você deve ver 4 tabelas:

- User
- Room
- Message
- \_UserRooms

### Passo 6: Registrar a Migration no Prisma

Ainda no console do PostgreSQL:

```sql
-- Criar tabela de migrations do Prisma
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- Registrar a migration como aplicada
INSERT INTO "_prisma_migrations"
("id", "checksum", "migration_name", "finished_at", "applied_steps_count")
VALUES
(
    '20251207_init',
    '0',
    '20251207_init',
    CURRENT_TIMESTAMP,
    1
)
ON CONFLICT DO NOTHING;
```

## ✅ Solução 3: Via Cliente SQL (TablePlus, DBeaver, etc)

Se você está usando um cliente SQL:

1. Conecte ao banco PostgreSQL do EasyPanel
2. Execute o SQL do **Passo 4** da Solução 2
3. Execute o SQL do **Passo 6** da Solução 2

## 🔍 Verificação Final

Após aplicar qualquer uma das soluções:

### Via SQL:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Via Prisma (após rebuild):

```bash
npx prisma db pull
```

## 🚀 Próximos Passos

1. ✅ Aplicar as tabelas (Solução 2 é mais rápida)
2. ✅ Testar o servidor com Postman
3. ✅ Fazer rebuild do container quando tiver tempo (para futuras migrations funcionarem)

## 💡 Para Evitar Isso no Futuro

Configure o **Pre Deploy Command** no EasyPanel:

1. **Settings** → **Advanced**
2. **Pre Deploy Command**:
   ```bash
   npx prisma migrate deploy || echo "No migrations to apply"
   ```

Isso tentará aplicar migrations automaticamente em cada deploy!
