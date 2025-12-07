import prisma from '../config/prisma';

export const createRoom = async (name: string, userIds: string[]) => {
  return await prisma.room.create({
    data: {
      name,
      users: {
        connect: userIds.map(id => ({ id }))
      }
    }
  });
};

export const getRoom = async (roomId: string) => {
  return await prisma.room.findUnique({
    where: { id: roomId },
    include: { users: true }
  });
};
