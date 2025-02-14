import MessageType from "@/enums/message.enum";
import { DefaultEventsMap, Server, Socket } from "socket.io";

interface ListenEvents {
  "room:join": (roomId: string, username: string) => void;
  "room:leave": (roomId: string) => void;

  "awser:send": (roomId: string, username: string, content: string) => void;
  "chat:send": (roomId: string, username: string, content: string) => void;
}

interface EmitEvents {
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

export interface AppSocket extends Server<ListenEvents, EmitEvents> {}

export interface SocketClient
  extends Socket<ListenEvents, EmitEvents, DefaultEventsMap, any> {}
