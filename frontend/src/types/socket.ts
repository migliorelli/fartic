import type { Socket } from "socket.io-client";
import type { Stroke } from "./canvas";
import type { GameRoom, Message, Player } from "./game";

export interface EmitEvents {
  ping: () => void;
  "room:join": (roomId: string, username: string) => void;
  "room:leave": (roomId: string) => void;

  "awser:send": (message: Message) => void;
  "chat:send": (message: Message) => void;

  "canvas:send": (roomTag: string, image: Stroke[]) => void;
}

export interface ListenEvents {
  pong: (pong: string) => void;
  "game:setup": (room: GameRoom, player: Player, players: Player[]) => void;

  "awser:receive": (message: Message) => void;
  "chat:receive": (message: Message) => void;

  "player:joined": (player: Player) => void;
  "player:left": (socketId: string) => void;

  "canvas:receive": (image: Stroke[]) => void;
}

export type AppSocket = Socket<ListenEvents, EmitEvents>;
