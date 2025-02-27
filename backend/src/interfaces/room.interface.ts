import RoomStatus from "@/enums/status.enum";
import { ObjectId } from "mongoose";
import { StrokeType } from "./canvas.interface";
import Player from "./player.interface";
import Theme from "./theme.interface";

interface Room {
  _id: string;
  name: string;
  players: ObjectId[];
  theme: ObjectId;
  currentWord?: string;
  playerLimit: number;
  currendDrawer?: string;
  status: RoomStatus;
  private: boolean;
  targetPontuation: number;
  tag: string;
  images: StrokeType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedRoom extends Omit<Room, "players" | "theme"> {
  players: Player[];
  theme: Theme;
}

export interface GameRoom
  extends Omit<
    Room,
    "players" | "playerLimit" | "private" | "createdAt" | "updatedAt" | "theme"
  > {
  theme: Theme;
}

export default Room;
