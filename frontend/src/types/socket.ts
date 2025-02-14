import type { Socket } from "socket.io-client";
import type MessageType from "../enums/message";

export interface EmitEvents {
  "room:join": (roomId: string, username: string) => void;
  "room:leave": (roomId: string) => void;

  "awser:send": (roomId: string, username: string, content: string) => void;
  "chat:send": (roomId: string, username: string, content: string) => void;
}

export interface ListenEvents {
  "awser:receive": (
    roomId: string,
    title: string,
    content: string,
    type: MessageType,
  ) => void;

  "chat:receive": (
    roomId: string,
    title: string,
    content: string,
    type: MessageType,
  ) => void;

  "player:joined": (socketId: string, username: string, tag: string) => void;
  "player:left": (socketId: string) => void;
}

export type AppSocket = Socket<ListenEvents, EmitEvents>;
