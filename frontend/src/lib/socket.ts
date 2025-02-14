import { io } from "socket.io-client";
import type { AppSocket } from "../types/socket";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;
const socket: AppSocket = io(SOCKET_URL);

export default socket;
