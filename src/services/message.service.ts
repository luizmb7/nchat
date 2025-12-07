import prisma from '../config/prisma';

export const saveMessage = async (roomId: string, userId: string, content: string, type: string = 'text') => {
  return await prisma.message.create({
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
};

export const getMessages = async (roomId: string) => {
  return await prisma.message.findMany({
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
};
