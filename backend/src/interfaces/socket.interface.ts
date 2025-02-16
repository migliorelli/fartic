import { DefaultEventsMap, Server, Socket } from "socket.io";
import Message from "./message.interface";
import Player from "./player.interface";
import { GameRoom } from "./room.interface";

interface ListenEvents {
  ping: () => void;
  "room:join": (roomTag: string, username: string) => void;
  "room:leave": (roomTag: string) => void;

  "awser:send": (message: Message) => void;
  "chat:send": (message: Message) => void;
}

interface EmitEvents {
  pong: (pong: string) => void;
  "game:setup": (gameRoom: GameRoom, player: Player, players: Player[]) => void;

  "awser:receive": (message: Message) => void;
  "chat:receive": (message: Message) => void;

  "player:joined": (player: Player) => void;
  "player:left": (socketId: string) => void;
}

export interface AppSocket extends Server<ListenEvents, EmitEvents> {}

export interface SocketClient
  extends Socket<ListenEvents, EmitEvents, DefaultEventsMap, any> {}
