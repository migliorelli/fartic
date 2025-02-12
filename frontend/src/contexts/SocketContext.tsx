import { MessageTypeEnum } from "@/models/message";
import { Player } from "@/models/player";
import { LoginRoom } from "@/models/rooms";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

export interface CanvasLine {
  points: number[];
  color: string;
}

export interface EmitEvents {
  sendAnswer: (publicId: string, playerId: number, content: string) => void;
  sendMessage: (publicId: string, playerId: number, content: string) => void;

  sendCanvasLine: (publicId: string, line: CanvasLine) => void;

  requestHint: (publicId: string) => void;
  startGame: (publicId: string) => void;

  joinRoom: (publicId: string, username: string) => void;
}

export interface ListenEvents {
  error: (str: string) => void;
  answer: (title: string, content: string, type: MessageTypeEnum) => void;
  message: (title: string, content: string, type: MessageTypeEnum) => void;

  canvasLine: (line: CanvasLine) => void;

  hint: (hint: string[]) => void;
  nextRound: (nextToPlay: Player) => void;
  endRound: (word: string) => void;

  playerLeft: (playerId: number) => void;
  newOwner: (playerId: number) => void;

  user: (user: Player, room: LoginRoom) => void;
  players: (players: Player[]) => void;
  fullRoom: () => void;
}

export type TypedSocket = Socket<ListenEvents, EmitEvents>;

interface SocketContext {
  user: Player | null;
  socket: TypedSocket | null;
  room: LoginRoom | null;
  canDraw: boolean;
  ongoing: boolean;
  players: Player[];
}

const socketContext = createContext<SocketContext>({} as SocketContext);

interface SocketProviderProps extends PropsWithChildren {
  publicId: string;
  username: string;
}

const SocketProvider = ({
  children,
  publicId,
  username,
}: SocketProviderProps) => {
  const [user, setUser] = useState<Player | null>(null);
  const [canDraw, setIsDrawing] = useState(false);
  const [ongoing, setOngoing] = useState(false);
  const [room, setRoom] = useState<LoginRoom | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const socket = useRef<TypedSocket | null>(null);

  useEffect(() => {
    const socketUrl = "http://localhost:3000/room";

    socket.current = io(socketUrl) as TypedSocket;
    console.log("Socket connected: ", socket.current.id);

    // join the room
    socket.current.emit("joinRoom", publicId, username);

    // receive the user
    socket.current.on("user", (userData, roomData) => {
      setUser(userData);
      setRoom(roomData);
    });

    return () => {
      if (socket.current) {
        setUser(null);
        console.log(`Socket ${socket.current.id} disconnected.`);
        socket.current.disconnect();
        socket.current.off("user");
      }
    };
  }, [publicId, username]);

  useEffect(() => {
    if (!socket.current) return;

    const onEndRound = () => {
      setOngoing(false);
      setIsDrawing(false);
    };
    socket.current.on("endRound", onEndRound);

    const onNextRound = (player: Player) => {
      setOngoing(true);
      if (player.id === user?.id) {
        setIsDrawing(true);
      }
    };

    socket.current.on("nextRound", onNextRound);

    return () => {
      if (socket.current) {
        socket.current.off("endRound", onEndRound);
        socket.current.off("nextRound", onNextRound);
      }
    };
  }, [user?.id]);

  useEffect(() => {
    if (!socket.current) return;

    const onPlayers = (newPlayers: Player[]) => {
      setPlayers(newPlayers);
    };

    socket.current.on("players", onPlayers);

    const onPlayerLeft = (id: number) => {
      setPlayers((prev) => prev.filter((player) => player.id !== id));
    };
    socket.current.on("playerLeft", onPlayerLeft);

    return () => {
      if (socket.current) {
        socket.current.off("playerLeft", onPlayerLeft);
        socket.current.off("players", onPlayers);
      }
    };
  }, [socket]);

  return (
    <socketContext.Provider
      value={{ user, room, socket: socket.current, canDraw, ongoing, players }}
    >
      {children}
    </socketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => useContext(socketContext);
