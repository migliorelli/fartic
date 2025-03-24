import { DefaultEventsMap, Server, Socket } from "socket.io";
import { Stroke } from "./canvas.interface";
import Message from "./message.interface";
import Player from "./player.interface";
import { GameRoom } from "./room.interface";

interface ListenEvents {
  ping: () => void;
  "room:join": (roomTag: string, username: string) => void;
  "room:leave": (roomTag: string) => void;

  "awser:send": (message: Message) => void;
  "chat:send": (message: Message) => void;

  "canvas:send": (roomTag: string, images: Stroke[]) => void;
  "game:start": (roomTag: string) => void;
}

interface EmitEvents {
  pong: (pong: string) => void;
  "game:setup": (gameRoom: GameRoom, player: Player, players: Player[]) => void;

  "awser:receive": (message: Message) => void;
  "chat:receive": (message: Message) => void;

  players: (players: Player[]) => void;

  "canvas:receive": (images: Stroke[]) => void;

  "game:round-drawer": (word: string) => void;
  "game:round": () => void;
}

export interface AppSocket extends Server<ListenEvents, EmitEvents> {}

export interface SocketClient
  extends Socket<ListenEvents, EmitEvents, DefaultEventsMap, any> {}
