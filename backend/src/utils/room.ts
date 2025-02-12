import prisma from "./prisma";

export const findRoomById = async (roomId: number) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  return room;
};

export const findRoomByPublicId = async (publicId: string) => {
  const room = await prisma.room.findUnique({
    where: { publicId },
    include: {
      users: {},
      owner: {},
    },
  });

  return room;
};
