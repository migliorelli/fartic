import prisma from "./prisma";

export const findUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
};
