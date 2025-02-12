import { Player } from "@/models/player";
import { io, Socket } from "socket.io-client";

interface ListenEvents {
  canvasImage: (canvasImage: string) => void;
  error: (data: { message: string }) => void;
  user: (user: Player) => void;
}

interface EmitEvents {
  joinRoom: (publicId: string, username: string) => void;
  sendCanvasImage: (canvasImage: string) => void;
}

type TypedSocket = Socket<ListenEvents, EmitEvents>;

const SOCKET_URL = "http://26.181.43.237:3000/room";

export const socket: TypedSocket = io(SOCKET_URL, {
  autoConnect: false,
});
