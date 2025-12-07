-- ============================================
-- Script SQL para Criar Todas as Tabelas
-- Execute este script no seu cliente SQL
-- ============================================

-- 1. Criar tabela User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- 2. Criar tabela Room
CREATE TABLE IF NOT EXISTS "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- 3. Criar tabela Message
CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'text',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- 4. Criar tabela de relacionamento _UserRooms
CREATE TABLE IF NOT EXISTS "_UserRooms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- 5. Criar índices
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
CREATE INDEX IF NOT EXISTS "_UserRooms_B_index" ON "_UserRooms"("B");

-- 6. Adicionar Foreign Keys (com verificação)
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

-- 7. Criar tabela de migrations do Prisma (para rastreamento)
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

-- 8. Registrar a migration como aplicada
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

-- ============================================
-- Verificação
-- ============================================

-- Listar todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Resultado esperado:
-- Message
-- Room
-- User
-- _UserRooms
-- _prisma_migrations
