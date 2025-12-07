"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const room_service_1 = require("./services/room.service");
const message_service_1 = require("./services/message.service");
const user_service_1 = require("./services/user.service");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('WebSocket Server is running');
});
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // 1. Create Room
    socket.on('create_room', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, userId } = payload;
            // Ensure user exists (in a real app, middleware would handle auth/user existence)
            // Here we assume client joins with an ID or we strictly just link it.
            // Let's rely on join_room to create user if needed or just assume ID is valid UUID.
            // For robustness:
            const newRoom = yield (0, room_service_1.createRoom)(name, [userId]);
            socket.emit('room_created', newRoom);
            console.log(`Room created: ${newRoom.name} (${newRoom.id}) by ${userId}`);
        }
        catch (err) {
            console.error("Error creating room:", err);
            socket.emit('error', { code: 'CREATE_ROOM_FAILED', message: 'Failed to create room' });
        }
    }));
    // 2. Join Room (And create user if not exists for demo purposes)
    socket.on('join_room', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { roomId, userId, username, avatar } = payload;
            // Upsert User
            yield (0, user_service_1.createUser)(userId, username, avatar);
            // Note: In real app, userId should be the unique key. The service uses username. 
            // Let's adjust the service if needed, but for now assuming username is unique enough or userId matches.
            // Actually, if userId is UUID, we should use that. 
            // Let's assume the client sends a persistent userId.
            const room = yield (0, room_service_1.getRoom)(roomId);
            if (!room) {
                socket.emit('error', { code: 'ROOM_NOT_FOUND', message: 'Room not found' });
                return;
            }
            yield socket.join(roomId);
            // Load previous messages
            const messages = yield (0, message_service_1.getMessages)(roomId);
            socket.emit('history', messages);
            // Notify room
            socket.to(roomId).emit('user_joined', { userId, username });
            console.log(`User ${username} (${userId}) joined room ${roomId}`);
        }
        catch (err) {
            console.error("Error joining room:", err);
            socket.emit('error', { code: 'JOIN_FAILED', message: 'Failed to join room' });
        }
    }));
    // 3. Send Message
    socket.on('send_message', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { roomId, userId, content, type } = payload;
            const message = yield (0, message_service_1.saveMessage)(roomId, userId, content, type);
            // Broadcast to room (including sender, or exclude sender? usually include so they know it's sent/confirmed)
            io.to(roomId).emit('message_received', message);
        }
        catch (err) {
            console.error("Error sending message:", err);
            socket.emit('error', { code: 'SEND_FAILED', message: 'Failed to send message' });
        }
    }));
    // 4. Typing Indicator
    socket.on('typing', (payload) => {
        const { roomId, userId, isTyping } = payload;
        socket.to(roomId).emit('user_typing', { userId, isTyping });
    });
    // 5. Leave Room
    socket.on('leave_room', (payload) => {
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
