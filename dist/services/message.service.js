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
exports.getMessages = exports.saveMessage = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const saveMessage = (roomId_1, userId_1, content_1, ...args_1) => __awaiter(void 0, [roomId_1, userId_1, content_1, ...args_1], void 0, function* (roomId, userId, content, type = 'text') {
    return yield prisma_1.default.message.create({
        data: {
            content,
            type,
            roomId,
            userId
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            }
        }
    });
});
exports.saveMessage = saveMessage;
const getMessages = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.message.findMany({
        where: { roomId },
        orderBy: { createdAt: 'asc' },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            }
        }
    });
});
exports.getMessages = getMessages;
