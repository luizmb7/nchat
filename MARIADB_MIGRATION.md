# Migração para MariaDB - Guia Completo

## 📋 Mudanças Realizadas

O projeto foi migrado de PostgreSQL para MariaDB com prefixo `tbl_` em todas as tabelas.

### Tabelas Criadas

- ✅ `tbl_User` - Usuários do chat
- ✅ `tbl_Room` - Salas de chat
- ✅ `tbl_Message` - Mensagens
- ✅ `tbl_UserRooms` - Relacionamento Many-to-Many entre usuários e salas

### Arquivos Modificados

1. **`prisma/schema.prisma`** - Provider alterado para `mysql`, adicionado `@@map("tbl_*")` em todos os models
2. **`docker-compose.yml`** - PostgreSQL substituído por MariaDB 10.11
3. **`.env.example`** - Connection string atualizada para MySQL
4. **`create-tables.sql`** - SQL atualizado para sintaxe MariaDB
5. **`prisma/migrations/20251207_mariadb_init/`** - Nova migration para MariaDB

## 🚀 Como Usar Localmente

### Passo 1: Atualizar .env

Edite o arquivo `.env` (crie se não existir):

```env
DATABASE_URL="mysql://user:password@localhost:3306/nchat"
PORT=3000
NODE_ENV=development
```

### Passo 2: Iniciar MariaDB com Docker

```bash
docker-compose up -d
```

Isso iniciará o MariaDB na porta 3306.

### Passo 3: Aplicar Migrations

```bash
npx prisma migrate deploy
```

Ou se preferir criar as tabelas manualmente:

```bash
# Conectar ao MariaDB
docker exec -it nchat-mariadb-1 mysql -u user -ppassword nchat

# Executar o conteúdo de create-tables.sql
```

### Passo 4: Gerar Prisma Client

```bash
npx prisma generate
```

### Passo 5: Iniciar o Servidor

```bash
npm run dev
```

## 🌐 Deploy no EasyPanel

### Passo 1: Criar Serviço MariaDB

1. No EasyPanel, vá até seu projeto
2. Clique em **+ Service** → **Database** → **MariaDB**
3. Configure:
   - Nome: `mariadb`
   - Database: `nchat`
   - User: `user`
   - Password: (defina uma senha segura)

### Passo 2: Atualizar Variáveis de Ambiente

No serviço `websocket-server`, atualize a variável `DATABASE_URL`:

```
DATABASE_URL="mysql://user:password@mariadb:3306/nchat"
```

**Importante:** Use `@mariadb` (nome do serviço) ao invés de `localhost` no EasyPanel.

### Passo 3: Redeploy

1. Faça commit e push das mudanças:

   ```bash
   git add .
   git commit -m "Migrate to MariaDB with tbl_ prefix"
   git push origin main
   ```

2. No EasyPanel, clique em **Deploy** no serviço `websocket-server`

### Passo 4: Aplicar Migrations

Após o deploy, no console do serviço `websocket-server`:

```bash
npx prisma migrate deploy
```

Ou execute o SQL manualmente no console do MariaDB:

1. Vá até o serviço **mariadb** → **Console**
2. Execute:
   ```bash
   mysql -u user -p nchat
   ```
3. Cole o conteúdo de `create-tables.sql`

## 🔍 Verificação

### Verificar Tabelas Criadas

```sql
SHOW TABLES;
```

Deve mostrar:

- `tbl_Message`
- `tbl_Room`
- `tbl_User`
- `tbl_UserRooms`
- `_prisma_migrations`

### Verificar Estrutura de uma Tabela

```sql
DESCRIBE tbl_User;
```

## 🧪 Testar

Use o `test-client.html` para testar:

1. Abra `test-client.html` no navegador
2. Configure a URL do servidor
3. Conecte e teste criar sala/enviar mensagens
4. Verifique no banco se os dados estão sendo salvos nas tabelas com prefixo `tbl_`

## ⚠️ Diferenças Importantes

### PostgreSQL → MariaDB

1. **IDs**: Mudou de UUID para CUID (compatível com MariaDB)
2. **Tipos de Dados**:
   - `TEXT` → `TEXT` (MariaDB)
   - `TIMESTAMP(3)` → `DATETIME(3)`
   - `VARCHAR(191)` para IDs (limite do MariaDB com utf8mb4)
3. **Sintaxe SQL**: Backticks (\`) ao invés de aspas duplas (")

### Connection String

**Antes (PostgreSQL):**

```
postgresql://user:password@localhost:5432/nchat?schema=public
```

**Agora (MariaDB):**

```
mysql://user:password@localhost:3306/nchat
```

## 🔄 Migração de Dados (Se Necessário)

Se você tinha dados no PostgreSQL e precisa migrar:

1. **Exportar do PostgreSQL:**

   ```bash
   pg_dump -U user -d nchat > backup.sql
   ```

2. **Converter SQL** (ajustar sintaxe PostgreSQL → MariaDB)

3. **Importar no MariaDB:**
   ```bash
   mysql -u user -p nchat < backup_converted.sql
   ```

**Nota:** A conversão de SQL pode exigir ajustes manuais devido às diferenças de sintaxe.

## 💡 Dicas

- Use **TablePlus**, **DBeaver** ou **phpMyAdmin** para gerenciar o MariaDB visualmente
- O prefixo `tbl_` facilita a identificação das tabelas do chat no seu sistema
- MariaDB é totalmente compatível com MySQL, então ferramentas MySQL funcionam
- Para desenvolvimento local, use `docker-compose up -d` para iniciar o banco rapidamente

## 📚 Referências

- [Prisma com MySQL](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [MariaDB Documentation](https://mariadb.org/documentation/)
- [Docker Compose com MariaDB](https://hub.docker.com/_/mariadb)
