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
  theme: Theme;
  private: boolean;
  tag: string;
  targetPontuation: number;
  updatedAt: Date | string;
  createdAt: Date | string;
}

export interface GameRoom {
  _id: string;
  tag: string;
  name: string;
  currentWord?: string;
  currentDrawer?: string;
  status: RoomStatus;
  theme: Theme;
  targetPontuation: number;
}

export interface Message {
  roomTag: string;
  title: string;
  content: string;
  type: MessageType;
}

export interface Theme {
  _id: string;
  name: string;
  words: string[];
  updatedAt: Date | string;
  createdAt: Date | string;
}

export interface Player {
  _id: string;
  socketId: string;
  username: string;
  score: number;
  tag: string;
  owner: string;
  updatedAt: Date | string;
  createdAt: Date | string;
}
