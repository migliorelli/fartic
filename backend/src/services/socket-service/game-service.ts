import { User } from "@prisma/client";
import { AppSocket } from ".";
import prisma from "../../utils/prisma";

const startRound = async (
  socket: AppSocket,
  roomId: number,
  themeId: number,
): Promise<{ player?: User; error?: string }> => {
  /*
  Recent players can also have 0 inactiveRounds.
  So if there's a draw
  the next to play is the oldest one.
  As the array is ordered by 
  createdAt (asc) and inactiveRounds (desc),
  the next to play will always be the first.
  */
  const nextToPlay = await prisma.user.findFirst({
    where: {
      roomId,
    },
    orderBy: {
      inactiveRounds: "desc",
      createdAt: "asc",
    },
  });

  if (!nextToPlay) {
    return {
      error: "No ready players found.",
    };
  }

  const words = await prisma.word.findMany({
    where: {
      themeId,
    },
  });

  const randomIndex = Math.floor(Math.random() * words.length);
  const chosenWord = words[randomIndex];

  const round = await prisma.round.create({
    data: {
      roomId,
      wordId: chosenWord.id,
      playerId: nextToPlay.id,
      hint: chosenWord.content.split("").map(() => ""),
    },
  });

  setTimeout(async () => {
    const ongoingRound = await prisma.round.findUnique({
      where: { id: round.id },
      include: {
        word: true,
      },
    });

    if (ongoingRound?.ongoing) {
      // end round
      await prisma.round.update({
        where: { id: round.id },
        data: { ongoing: false },
      });

      socket.nsp
        .to(`room_${roomId}`)
        .emit("endRound", ongoingRound.word.content);
    }
  }, 120000);

  return { player: nextToPlay };
};

const setupSocketGame = async (socket: AppSocket) => {
  socket.on("startGame", async (publicId) => {
    try {
      const room = await prisma.room.findUnique({
        where: { publicId },
      });

      if (!room) {
        socket.emit("error", "Room does not exist.");
        console.error(`Error: room ${publicId} does not exist.`);
        return;
      }

      const nextToPlay = await startRound(socket, room.id, room.themeId);

      if (nextToPlay.error) {
        socket.emit("error", nextToPlay.error);
        console.error(`Error: ${nextToPlay.error}`);
      } else if (nextToPlay.player) {
        socket.nsp
          .to(`room_${room.publicId}`)
          .emit("nextRound", nextToPlay.player);
      }
    } catch (err) {
      console.error("Error in startRound.", err);
      socket.emit("error", "Error starting the round.");
    }
  });

  socket.on("requestHint", async (publicId) => {
    try {
      const round = await prisma.round.findFirst({
        where: {
          room: {
            publicId,
          },
          ongoing: true,
        },
        include: {
          word: {
            select: { content: true },
          },
        },
      });

      if (!round) {
        socket.emit("error", "Error generating tip.");
        return;
      }

      const word = round.word.content;
      const wordLength = word.length;

      let hintLimit = 0;
      if (wordLength == 3) {
        hintLimit = 1;
      } else if (wordLength >= 4) {
        hintLimit = Math.ceil(0.3 * wordLength);
      }

      const currentHint = round.hint as string[];

      const blankLetterIndexes = currentHint
        .map((letter, index) => (letter === "" ? index : -1))
        .filter((index) => index !== -1);

      if (currentHint.filter((letter) => letter !== "").length >= hintLimit) {
        return;
      }

      const randomIndex =
        blankLetterIndexes[
          Math.floor(Math.random() * blankLetterIndexes.length)
        ];

      currentHint[randomIndex] = word[randomIndex];

      await prisma.round.update({
        where: { id: round.id },
        data: { hint: currentHint.join("") },
      });

      socket.emit("hint", currentHint);
    } catch (err) {
      console.error("Error in requestHint.", err);
    }
  });
};

export default setupSocketGame;
