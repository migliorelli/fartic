import { AppSocket, MessageTypeEnum } from ".";
import { strikeAMatch } from "../../lib/strike-a-match";
import prisma from "../../utils/prisma";
import { findUserById } from "../../utils/user";

const setupSocketAnswer = async (socket: AppSocket) => {
  socket.on("sendAnswer", async (publicId, userId, content) => {
    const sender = await findUserById(userId);

    if (!sender) {
      socket.emit("error", "User does not exist.");
      return;
    }

    const round = await prisma.round.findFirst({
      where: {
        room: { publicId },
        ongoing: true,
      },
      select: {
        word: {
          select: { content: true },
        },
      },
    });

    if (!round) {
      socket.emit("error", "Round does not exist.");
      return;
    }

    const similarity = strikeAMatch(round.word.content, content);
    if (similarity === 1) {
      socket.nsp
        .to(`room_${publicId}`)
        .emit("answer", sender.username, "hit!", MessageTypeEnum.CONFIRM);
    } else if (similarity >= 0.4 && similarity < 1) {
      socket.emit("answer", content, "is close!", MessageTypeEnum.WARNING);
    } else {
      socket.nsp
        .to(`room_${publicId}`)
        .emit("answer", sender?.username, content, MessageTypeEnum.MESSAGE);
    }
  });
};

export default setupSocketAnswer;
