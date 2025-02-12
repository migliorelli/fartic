import { AppSocket, MessageTypeEnum } from ".";
import { findRoomByPublicId } from "../../utils/room";
import { findUserById } from "../../utils/user";

const setupSocketChat = async (socket: AppSocket) => {
  socket.on("sendMessage", async (publicId, userId, content) => {
    const room = await findRoomByPublicId(publicId);
    const sender = await findUserById(userId);

    if (!room) {
      socket.emit("error", "Room does not exist.");
      return;
    }

    if (!sender) {
      socket.emit("error", "User does not exist.");
      return;
    }

    socket.nsp
      .to(`room_${publicId}`)
      .emit("message", sender.username, content, MessageTypeEnum.MESSAGE);
  });
};

export default setupSocketChat;
