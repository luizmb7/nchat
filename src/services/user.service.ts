import prisma from '../config/prisma';

export const createUser = async (id: string, username: string, avatar?: string) => {
  return await prisma.user.upsert({
    where: { id },
    update: { username, avatar },
    create: { id, username, avatar }
  });
};

export const getUser = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId }
  });
};
