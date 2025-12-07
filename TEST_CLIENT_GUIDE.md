# 🧪 Cliente de Teste WebSocket

## 🎯 Problema com Postman

O Postman pode ter dificuldades com Socket.IO porque:

- Socket.IO usa um protocolo específico sobre WebSocket
- Eventos precisam ser registrados manualmente
- A interface do Postman não é ideal para Socket.IO

## ✅ Solução: Cliente HTML de Teste

Criei um cliente visual completo que **automaticamente escuta TODOS os eventos**!

### 🚀 Como Usar

#### Passo 1: Abrir o Cliente

Simplesmente abra o arquivo no navegador:

```bash
open test-client.html
```

Ou clique duas vezes no arquivo `test-client.html`

#### Passo 2: Configurar

1. **URL do Servidor**:

   - Local: `http://localhost:3000`
   - EasyPanel: `https://seu-dominio.com` ou `wss://seu-dominio.com`

2. **User ID**: Use um UUID válido (já tem um preenchido)

3. **Username**: Seu nome de usuário

#### Passo 3: Conectar

Clique em **"Conectar"**

Você verá:

- Status muda para "● Conectado" (verde)
- Evento `connect` aparece no painel de eventos

#### Passo 4: Criar uma Sala

1. Digite o nome da sala (ex: "General Chat")
2. Clique em **"Criar Sala"**
3. Você receberá o evento `room_created` com o `roomId`
4. O `roomId` será automaticamente preenchido no campo "Room ID"

#### Passo 5: Entrar na Sala

Clique em **"Entrar na Sala"**

Você receberá:

- Evento `history` com mensagens anteriores (vazio se for nova)

#### Passo 6: Enviar Mensagem

1. Digite uma mensagem
2. Clique em **"Enviar Mensagem"**
3. Você receberá o evento `message_received`

### 📡 Eventos Automáticos

O cliente **automaticamente escuta** todos estes eventos:

✅ `connect` - Conexão estabelecida
✅ `disconnect` - Desconectado
✅ `room_created` - Sala criada
✅ `history` - Histórico de mensagens
✅ `message_received` - Nova mensagem
✅ `user_joined` - Usuário entrou
✅ `user_left` - Usuário saiu
✅ `user_typing` - Usuário digitando
✅ `error` - Erro do servidor

**Todos os eventos aparecem automaticamente no painel "Eventos Recebidos"!**

### 🎭 Testar com Múltiplos Usuários

Para simular múltiplos usuários:

1. Abra o `test-client.html` em **duas abas** do navegador
2. Use **User IDs diferentes** em cada aba
3. Na **Aba 1**: Crie uma sala
4. Copie o `roomId` que apareceu
5. Na **Aba 2**: Cole o `roomId` e clique em "Entrar na Sala"
6. Agora envie mensagens de ambas as abas!

**Você verá os eventos em tempo real em ambas as abas!**

### 🎨 Interface

- **Verde** = Eventos de sucesso
- **Vermelho** = Erros
- **JSON formatado** = Fácil de ler
- **Timestamp** = Hora de cada evento
- **Auto-scroll** = Eventos mais recentes no topo

### 🔧 Troubleshooting

**"Conecte ao servidor primeiro!"**

- Clique em "Conectar" antes de fazer outras ações

**Não recebe eventos:**

- Verifique se está conectado (status verde)
- Verifique a URL do servidor
- Abra o Console do navegador (F12) para ver erros

**CORS Error:**

- O servidor já está configurado com `cors: { origin: "*" }`
- Se ainda tiver erro, verifique se o servidor está rodando

### 💡 Vantagens sobre Postman

✅ **Escuta automática** de todos os eventos
✅ **Interface visual** amigável
✅ **Múltiplas abas** para simular vários usuários
✅ **Log completo** de todos os eventos
✅ **Funciona perfeitamente** com Socket.IO
✅ **Não precisa configurar** listeners manualmente

---

## 🚀 Fluxo Completo de Teste

```
1. Abrir test-client.html no navegador
2. Clicar em "Conectar"
3. Clicar em "Criar Sala"
4. Clicar em "Entrar na Sala"
5. Digitar mensagem e clicar em "Enviar Mensagem"
6. Ver todos os eventos no painel! 🎉
```

**Pronto! Agora você pode testar o servidor completamente!** 🚀
