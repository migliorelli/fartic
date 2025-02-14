import type MessageType from "../enums/message";
import type RoomStatus from "../enums/status";

export interface Room {
  _id: string;
  name: string;
  players: string[];
  currentWord?: string;
  currendDrawer?: string;
  playerLimit: number;
  status: RoomStatus;
  createdAt: Date | string;
}

export interface Message {
  roomId: string;
  title: string;
  content: string;
  type: MessageType;
}

export interface Theme {
  _id: string;
  name: string;
  words: string[];
}

export interface Player {
  _id: string;
  socketId: string;
  username: string;
  score: number;
  tag: string;
}
