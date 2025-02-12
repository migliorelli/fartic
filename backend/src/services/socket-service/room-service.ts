import { AppSocket, MessageTypeEnum } from ".";
import prisma from "../../utils/prisma";
import { findRoomByPublicId } from "../../utils/room";

const setupSocketRoom = async (socket: AppSocket) => {
  socket.on("joinRoom", async (publicId: string, username: string) => {
    let roomId = null;

    try {
      // find the room
      const room = await findRoomByPublicId(publicId);
      if (!room) {
        throw new Error();
      }

      if (room.users.length === room.playerLimit) {
        socket.emit("fullRoom");
        return;
      }

      // create the user
      const user = await prisma.user.create({
        data: {
          roomId: room.id,
          socketId: socket.id,
          username,
        },
        include: {
          room: {
            include: {
              theme: true,
            },
          },
        },
      });

      // check if is the first to enter
      let isOwner = room.users.length === 0;

      // if yes, the user is the new owner
      if (isOwner) {
        await prisma.room.update({
          where: { id: room.id },
          data: { ownerId: user.id },
        });
      }

      // join the socket room
      socket.join(`room_${room.publicId}`);
      console.log(`User ${user.id} joined room ${room.id}.`);

      const { themeId, ownerId, ...loginRoom } = user.room;

      // send the user objet to the frontend
      socket.emit("user", user, loginRoom);

      const players = await prisma.user.findMany({
        where: { roomId: room.id },
      });

      // send the new player list to the frontend
      socket.nsp.to(`room_${room.publicId}`).emit("players", players);
      socket.nsp
        .to(`room_${room.publicId}`)
        .emit(
          "message",
          user.username,
          "Joined the room.",
          MessageTypeEnum.SERVER,
        );
    } catch {
      console.error("Error in joinRoom.");
      socket.emit("error", "Error joining the room.");
    }
  });
};

export default setupSocketRoom;
