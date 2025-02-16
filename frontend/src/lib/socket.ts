import { io } from "socket.io-client";
import type { AppSocket } from "../types/socket";

const socket: AppSocket = io("/", {
  path: `/api/socket.io`,
  transports: ["websocket"],
});

export function bindDefaultEvents() {
  socket.on("pong", console.log);
  socket.on("connect_error", console.error);
  socket.on("connect", () => {
    console.log("Socket connected.");
  });
}

export default socket;
