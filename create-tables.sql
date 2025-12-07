-- ============================================
-- Script SQL para Criar Todas as Tabelas (MariaDB)
-- Execute este script no seu cliente SQL MariaDB
-- ============================================

-- 1. Criar tabela tbl_user
CREATE TABLE IF NOT EXISTS `tbl_user` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `avatar` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `tbl_user_username_key`(`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Criar tabela tbl_room
CREATE TABLE IF NOT EXISTS `tbl_room` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Criar tabela tbl_message
CREATE TABLE IF NOT EXISTS `tbl_message` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'text',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `roomId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Criar tabela de relacionamento tbl_userrooms
CREATE TABLE IF NOT EXISTS `tbl_userrooms` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `tbl_userrooms_AB_unique`(`A`, `B`),
    INDEX `tbl_userrooms_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Adicionar Foreign Keys
ALTER TABLE `tbl_message` 
ADD CONSTRAINT `tbl_message_roomId_fkey` 
FOREIGN KEY (`roomId`) REFERENCES `tbl_room`(`id`) 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `tbl_message` 
ADD CONSTRAINT `tbl_message_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `tbl_user`(`id`) 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `tbl_userrooms` 
ADD CONSTRAINT `tbl_userrooms_A_fkey` 
FOREIGN KEY (`A`) REFERENCES `tbl_room`(`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbl_userrooms` 
ADD CONSTRAINT `tbl_userrooms_B_fkey` 
FOREIGN KEY (`B`) REFERENCES `tbl_user`(`id`) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 6. Criar tabela de migrations do Prisma (para rastreamento)
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
    `id` VARCHAR(36) NOT NULL,
    `checksum` VARCHAR(64) NOT NULL,
    `finished_at` DATETIME(3) NULL,
    `migration_name` VARCHAR(255) NOT NULL,
    `logs` TEXT NULL,
    `rolled_back_at` DATETIME(3) NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applied_steps_count` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7. Registrar a migration como aplicada
INSERT INTO `_prisma_migrations` 
(`id`, `checksum`, `migration_name`, `finished_at`, `applied_steps_count`)
VALUES 
(
    '20251207_mariadb_init',
    '0',
    '20251207_mariadb_init',
    CURRENT_TIMESTAMP(3),
    1
)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- ============================================
-- Verificação
-- ============================================

-- Listar todas as tabelas
SHOW TABLES;

-- Resultado esperado:
-- tbl_message
-- tbl_room
-- tbl_user
-- tbl_userrooms
-- _prisma_migrations
