import Status from "@/enums/status.enum";
import Player from "./player.interface";

interface Room {
  _id: string;
  name: string;
  players: Player[];
  currentWord?: string;
  currendDrawer?: string;
  status: Status;
  createdAt: Date;
}

export default Room;
