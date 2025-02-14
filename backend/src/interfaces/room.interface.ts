import RoomStatus from "@/enums/status.enum";
import { ObjectId } from "mongoose";
import Player from "./player.interface";
import Theme from "./theme.interface";

interface Room {
  _id: string;
  name: string;
  players: ObjectId[];
  currentWord?: string;
  playerLimit: number;
  theme: Theme;
  currendDrawer?: string;
  status: RoomStatus;
  createdAt: Date;
}

export interface PopulatedRoom extends Omit<Room, "players"> {
  players: Player[];
}

export default Room;
