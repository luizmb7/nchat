# Testando o WebSocket Server com Postman

Este guia mostra como testar o servidor WebSocket usando o Postman.

## Configuração Inicial

1. Abra o Postman
2. Crie uma nova requisição **WebSocket**
3. URL: `ws://seu-dominio.com` ou `wss://seu-dominio.com` (se tiver SSL)
4. Clique em **Connect**

## Sequência de Testes Recomendada

### 1. Criar uma Sala (Create Room)

**Enviar:**

```json
{
  "event": "create_room",
  "data": {
    "name": "General Chat",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "JohnDoe",
    "avatar": "https://i.pravatar.cc/150?img=1"
  }
}
```

**Formato Postman:**

- No campo de mensagem, cole:

```
create_room
```

- No campo de dados (se separado), cole:

```json
{
  "name": "General Chat",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "username": "JohnDoe",
  "avatar": "https://i.pravatar.cc/150?img=1"
}
```

**Resposta Esperada:**

```json
{
  "event": "room_created",
  "data": {
    "id": "abc-123-def-456",
    "name": "General Chat",
    "createdAt": "2025-12-07T12:00:00.000Z"
  }
}
```

**Copie o `id` da sala para usar nos próximos passos!**

---

### 2. Entrar na Sala (Join Room)

**Enviar:**

```json
{
  "event": "join_room",
  "data": {
    "roomId": "abc-123-def-456",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "JohnDoe",
    "avatar": "https://i.pravatar.cc/150?img=1"
  }
}
```

**Resposta Esperada:**

```json
{
  "event": "history",
  "data": []
}
```

---

### 3. Enviar Mensagem (Send Message)

**Enviar:**

```json
{
  "event": "send_message",
  "data": {
    "roomId": "abc-123-def-456",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Hello, World!",
    "type": "text"
  }
}
```

**Resposta Esperada:**

```json
{
  "event": "message_received",
  "data": {
    "id": "msg-uuid",
    "content": "Hello, World!",
    "type": "text",
    "createdAt": "2025-12-07T12:00:00.000Z",
    "roomId": "abc-123-def-456",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "JohnDoe",
      "avatar": "https://i.pravatar.cc/150?img=1"
    }
  }
}
```

---

### 4. Indicador de Digitação (Typing)

**Enviar:**

```json
{
  "event": "typing",
  "data": {
    "roomId": "abc-123-def-456",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "isTyping": true
  }
}
```

**Nota:** Outros usuários na sala receberão este evento.

---

### 5. Sair da Sala (Leave Room)

**Enviar:**

```json
{
  "event": "leave_room",
  "data": {
    "roomId": "abc-123-def-456",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Testando com Múltiplos Usuários

Para simular múltiplos usuários:

1. Abra **duas abas** do Postman
2. Conecte ambas ao WebSocket
3. Use **userIds diferentes** em cada aba:
   - Aba 1: `"userId": "550e8400-e29b-41d4-a716-446655440000"`
   - Aba 2: `"userId": "550e8400-e29b-41d4-a716-446655440001"`

### Fluxo de Teste Multi-Usuário:

1. **Aba 1**: Criar sala
2. **Aba 2**: Entrar na mesma sala (use o roomId da Aba 1)
3. **Aba 1**: Enviar mensagem → **Aba 2** receberá `message_received`
4. **Aba 2**: Enviar mensagem → **Aba 1** receberá `message_received`
5. **Aba 2**: Enviar `typing` → **Aba 1** receberá `user_typing`

---

## Formato Socket.IO no Postman

Se o Postman estiver usando Socket.IO, o formato pode ser diferente:

**Evento:** `create_room`

**Dados:**

```json
{
  "name": "General Chat",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "username": "JohnDoe"
}
```

---

## Tratamento de Erros

Se algo der errado, você receberá:

```json
{
  "event": "error",
  "data": {
    "code": "CREATE_ROOM_FAILED",
    "message": "Failed to create room"
  }
}
```

**Códigos de Erro Comuns:**

- `INVALID_PAYLOAD` - Campos obrigatórios faltando
- `CREATE_ROOM_FAILED` - Erro ao criar sala
- `JOIN_FAILED` - Erro ao entrar na sala
- `ROOM_NOT_FOUND` - Sala não encontrada
- `SEND_FAILED` - Erro ao enviar mensagem

---

## Dicas

1. **Gere UUIDs válidos**: Use um gerador online como https://www.uuidgenerator.net/
2. **Mantenha os IDs consistentes**: Use o mesmo `userId` em todas as requisições de um mesmo usuário
3. **Copie o roomId**: Após criar a sala, copie o `id` retornado para usar nas próximas requisições
4. **Monitore os logs**: Verifique os logs do servidor para debug

---

## Exemplo Completo de Fluxo

```
1. create_room → Recebe room_created (copie o roomId)
2. join_room → Recebe history (vazio inicialmente)
3. send_message → Recebe message_received
4. send_message → Recebe message_received
5. leave_room → Desconecta da sala
```
