# WebSocket API Documentation

## Connection

- **URL**: `ws://your-server-ip:3000` (or `wss://` if SSL configured)
- **Path**: `/socket.io/` (Default)
- **Transports**: `websocket`, `polling`

## Events (Client -> Server)

### 1. Create Room

Create a new chat room.

- **Event**: `create_room`
- **Payload**:

```json
{
  "name": "General Chat",
  "userId": "user-uuid"
}
```

### 2. Join Room

Join an existing room. Upserts the user.

- **Event**: `join_room`
- **Payload**:

```json
{
  "roomId": "room-uuid",
  "userId": "user-uuid",
  "username": "JohnDoe",
  "avatar": "https://example.com/avatar.png" // Optional
}
```

### 3. Send Message

Send a message to a room.

- **Event**: `send_message`
- **Payload**:

```json
{
  "roomId": "room-uuid",
  "userId": "user-uuid",
  "content": "Hello world!",
  "type": "text" // Default: "text". Future: "image"
}
```

### 4. Typing Indicator

Notify room of typing status.

- **Event**: `typing`
- **Payload**:

```json
{
  "roomId": "room-uuid",
  "userId": "user-uuid",
  "isTyping": true
}
```

### 5. Leave Room

Leave the current room.

- **Event**: `leave_room`
- **Payload**:

```json
{
  "roomId": "room-uuid",
  "userId": "user-uuid"
}
```

## Events (Server -> Client)

### 1. Room Created

Sent to creator after `create_room`.

- **Event**: `room_created`
- **Payload**:

```json
{
  "id": "room-uuid",
  "name": "General Chat",
  "createdAt": "timestamp"
}
```

### 2. History

Sent to user immediately after `join_room` success, containing previous messages.

- **Event**: `history`
- **Payload**: `Array<Message>`

```json
[
  {
    "id": "msg-uuid",
    "content": "Hi there",
    "userId": "sender-uuid",
    "user": { "username": "JaneDoe", "avatar": "..." },
    "createdAt": "..."
  }
]
```

### 3. Message Received

Broadcasted to all in room when a new message is sent.

- **Event**: `message_received`
- **Payload**:

```json
{
  "id": "msg-uuid",
  "content": "Hello world!",
  "userId": "sender-uuid",
  "user": { ... },
  "createdAt": "..."
}
```

### 4. User Joined

Broadcasted when a user joins.

- **Event**: `user_joined`
- **Payload**: `{ "userId": "...", "username": "..." }`

### 5. User Left

Broadcasted when a user leaves.

- **Event**: `user_left`
- **Payload**: `{ "userId": "..." }`

### 6. User Typing

Broadcasted when a user types.

- **Event**: `user_typing`
- **Payload**: `{ "userId": "...", "isTyping": true }`

### 7. Error

Sent when an operation fails.

- **Event**: `error`
- **Payload**: `{ "code": "ERR_CODE", "message": "Description" }`
