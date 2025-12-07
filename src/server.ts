import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRoom, getRoom } from './services/room.service';
import { saveMessage, getMessages } from './services/message.service';
import { createUser } from './services/user.service';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('WebSocket Server is running');
});

// Event Types
interface JoinRoomPayload {
  roomId: string; // can be existing ID or we treat create here? Requirement says "Create room" and "Join room" are events.
  userId: string;
  username: string; // for ephemeral user creation
  avatar?: string;
}

interface CreateRoomPayload {
  name: string;
  userId: string; // creator
  username?: string; // optional username for user creation
  avatar?: string; // optional avatar for user creation
}

interface SendMessagePayload {
  roomId: string;
  userId: string;
  content: string;
  type?: string;
}

interface TypingPayload {
  roomId: string;
  userId: string;
  isTyping: boolean;
}

io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // 1. Create Room
  socket.on('create_room', async (payload: CreateRoomPayload) => {
    try {
      const { name, userId, username, avatar } = payload;
      
      // Validate required fields
      if (!name || !userId) {
        socket.emit('error', { 
          code: 'INVALID_PAYLOAD', 
          message: 'Missing required fields: name and userId' 
        });
        return;
      }
      
      // Ensure user exists before creating room
      const finalUsername = username || `User_${userId.substring(0, 8)}`;
      await createUser(userId, finalUsername, avatar);
      
      const newRoom = await createRoom(name, [userId]);
      socket.emit('room_created', newRoom);
      console.log(`Room created: ${newRoom.name} (${newRoom.id}) by ${finalUsername}`);
    } catch (err) {
      console.error("Error creating room:", err);
      socket.emit('error', { code: 'CREATE_ROOM_FAILED', message: 'Failed to create room' });
    }
  });

  // 2. Join Room (And create user if not exists for demo purposes)
  socket.on('join_room', async (payload: JoinRoomPayload) => {
    try {
      const { roomId, userId, username, avatar } = payload;
      
      // Upsert User
      await createUser(userId, username, avatar);
      // Note: In real app, userId should be the unique key. The service uses username. 
      // Let's adjust the service if needed, but for now assuming username is unique enough or userId matches.
      // Actually, if userId is UUID, we should use that. 
      // Let's assume the client sends a persistent userId.
      
      const room = await getRoom(roomId);
      if (!room) {
        socket.emit('error', { code: 'ROOM_NOT_FOUND', message: 'Room not found' });
        return;
      }
      
      await socket.join(roomId);
      
      // Load previous messages
      const messages = await getMessages(roomId);
      socket.emit('history', messages);
      
      // Notify room
      socket.to(roomId).emit('user_joined', { userId, username });
      
      console.log(`User ${username} (${userId}) joined room ${roomId}`);
    } catch (err) {
      console.error("Error joining room:", err);
      socket.emit('error', { code: 'JOIN_FAILED', message: 'Failed to join room' });
    }
  });

  // 3. Send Message
  socket.on('send_message', async (payload: SendMessagePayload) => {
    try {
      const { roomId, userId, content, type } = payload;
      
      const message = await saveMessage(roomId, userId, content, type);
      
      // Broadcast to room (including sender, or exclude sender? usually include so they know it's sent/confirmed)
      io.to(roomId).emit('message_received', message);
    } catch (err) {
      console.error("Error sending message:", err);
      socket.emit('error', { code: 'SEND_FAILED', message: 'Failed to send message' });
    }
  });
  
  // 4. Typing Indicator
  socket.on('typing', (payload: TypingPayload) => {
    const { roomId, userId, isTyping } = payload;
    socket.to(roomId).emit('user_typing', { userId, isTyping });
  });

  // 5. Leave Room
  socket.on('leave_room', (payload: { roomId: string, userId: string }) => {
    const { roomId, userId } = payload;
    socket.leave(roomId);
    socket.to(roomId).emit('user_left', { userId });
    console.log(`User ${userId} left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
