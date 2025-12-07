# Como Aplicar as Correções no EasyPanel

O erro do Prisma foi corrigido! Siga estas etapas para aplicar as correções:

## ✅ Correções Aplicadas

1. **Dockerfile** - Adicionada instalação do OpenSSL
2. **prisma/schema.prisma** - Configurado binaryTarget para Alpine Linux
3. **package.json** - Adicionados scripts de migração

## 🚀 Passos para Redeploy

### Opção 1: Redeploy Automático (Recomendado)

1. **Commit e Push das mudanças**:

   ```bash
   git add .
   git commit -m "Fix: Prisma compatibility with Alpine Linux"
   git push origin main
   ```

2. **No EasyPanel**:
   - Vá até o serviço `websocket-server`
   - Clique em **Deploy** (ou aguarde o webhook automático se configurado)
   - Acompanhe os logs durante o build

### Opção 2: Rebuild Manual

Se você não está usando Git:

1. **No EasyPanel**, vá até o serviço `websocket-server`
2. Clique em **Rebuild**
3. Aguarde o processo de build completar

## 🗄️ Aplicar Migrations do Banco de Dados

Após o deploy, você precisa criar as tabelas no banco:

### Método 1: Via EasyPanel Console

1. No EasyPanel, vá até o serviço `websocket-server`
2. Clique na aba **Console** ou **Terminal**
3. Execute:
   ```bash
   npx prisma migrate deploy
   ```

### Método 2: Via Deploy Command (Automático)

1. No EasyPanel, vá até o serviço `websocket-server`
2. Vá em **Settings** → **Advanced**
3. Em **Pre Deploy Command** ou **Post Deploy Command**, adicione:
   ```bash
   npx prisma migrate deploy
   ```
4. Salve e faça redeploy

### Método 3: SQL Direto (Alternativa)

Se preferir executar SQL diretamente:

1. Vá até o serviço PostgreSQL no EasyPanel
2. Abra o **Console** do banco
3. Execute o conteúdo do arquivo `prisma/init.sql`

## ✅ Verificação

Após o deploy, verifique os logs:

1. Vá até a aba **Logs** do serviço
2. Você deve ver: `Server is running on port 3000`
3. Não deve haver erros de `libssl.so.1.1`

## 🧪 Testar a Conexão

Use o exemplo PHP ou Flutter para testar:

```bash
# URL do WebSocket
wss://seu-dominio.com
```

## ❓ Problemas?

Se ainda houver erros:

1. **Verifique a variável DATABASE_URL**:

   - Deve estar no formato: `postgresql://user:password@postgres:5432/nchat?schema=public`

2. **Verifique se o PostgreSQL está rodando**:

   - No EasyPanel, confirme que o serviço `postgres` está ativo

3. **Logs detalhados**:

   - Vá em **Logs** e procure por mensagens de erro específicas

4. **Rebuild completo**:
   - Às vezes é necessário fazer um rebuild completo do container
   - No EasyPanel: **Settings** → **Rebuild**
