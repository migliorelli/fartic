import { Theme, User } from "@prisma/client";
import { Server, Socket } from "socket.io";
import prisma from "../../utils/prisma";
import setupSocketAnswer from "./answer-service";
import setupSocketCanvas from "./canvas-service";
import setupSocketChat from "./chat-serivce";
import setupSocketGame from "./game-service";
import setupSocketRoom from "./room-service";

export enum MessageTypeEnum {
  SERVER = "SERVER",
  CONFIRM = "CONFIRM",
  WARNING = "WARNING",
  MESSAGE = "MESSAGE",
}

interface CanvasLine {
  points: number[];
  color: string;
}

interface LoginRoom {
  id: number;
  points: number;
  createdAt: Date;
  publicId: string;
  visible: boolean;
  playerLimit: number;
  theme: Theme;
}

type ListenEvents = {
  sendAnswer: (publicId: string, playerId: number, content: string) => void;
  sendMessage: (publicId: string, playerId: number, content: string) => void;

  sendCanvasLine: (publicId: string, line: CanvasLine) => void;

  requestHint: (publicId: string) => void;
  startGame: (publicId: string) => void;

  joinRoom: (publicId: string, username: string) => void;
};

type EmitEvents = {
  error: (str: string) => void;
  answer: (title: string, content: string, type: MessageTypeEnum) => void;
  message: (title: string, content: string, type: MessageTypeEnum) => void;

  canvasLine: (line: CanvasLine) => void;

  hint: (hint: string[]) => void;
  nextRound: (nextToPlay: User) => void;
  endRound: (word: string) => void;

  playerLeft: (playerId: number) => void;
  newOwner: (playerId: number) => void;

  user: (user: User, room: LoginRoom) => void;
  players: (players: User[]) => void;
  fullRoom: () => void;
};

export type AppSocket = Socket<ListenEvents, EmitEvents>;

export const setupSocket = (io: Server<ListenEvents, EmitEvents>) => {
  io.of("/room").on("connection", async (socket) => {
    console.log("A user connected: ", socket.id);

    setupSocketRoom(socket);
    setupSocketAnswer(socket);
    setupSocketChat(socket);
    setupSocketGame(socket);
    setupSocketCanvas(socket);
    setupSocketDisconnection(socket);
  });
};

const setupSocketDisconnection = async (socket: AppSocket) => {
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);

    try {
      // delete user after disconnection
      const deletedUser = await prisma.user.delete({
        where: { socketId: socket.id },
        include: {
          room: {
            include: {
              users: {
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      });

      if (!deletedUser) {
        return;
      }

      // how many players are left
      const players = deletedUser.room.users;

      // if there are no more players, delete the room
      if (players.length === 0) {
        await prisma.room.delete({
          where: { id: deletedUser.room.id },
        });

        console.log(`Room ${deletedUser.room.id} deleted due to no users.`);
      } else if (deletedUser.id === deletedUser.room.ownerId) {
        /*
        If there are more players and
        the one who left was the owner,
        set the new owner.
        */
        const newOwner = deletedUser.room.users[0];
        await prisma.room.update({
          where: { id: deletedUser.roomId },
          data: { ownerId: newOwner.id },
        });

        // tell the frontend the new owner
        socket.nsp
          .to(`room_${deletedUser.room.publicId}`)
          .emit("newOwner", newOwner.id);
      }

      // tell the frontend that the user left
      socket.nsp
        .to(`room_${deletedUser.room.publicId}`)
        .emit("playerLeft", deletedUser.id);

      // show in the chat
      socket.nsp
        .to(`room_${deletedUser.room.publicId}`)
        .emit(
          "message",
          deletedUser.username,
          "Left the room.",
          MessageTypeEnum.SERVER,
        );
    } catch (err) {
      console.error("Error deleting empty room", err);
    }
  });
};
