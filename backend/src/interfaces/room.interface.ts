import Status from "@/enums/status.enum";
import { ObjectId } from "mongoose";
import Player from "./player.interface";

interface Room {
  _id: string;
  name: string;
  players: ObjectId[];
  currentWord?: string;
  currendDrawer?: string;
  status: Status;
  createdAt: Date;
}

export interface PopulatedRoom extends Omit<Room, "players"> {
  players: Player[];
}

export default Room;
