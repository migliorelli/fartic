import { Theme } from "./game";

export interface Room {
  publicId: string;
  createdAt: string;
  themeId: number;

  playerCount: number;
  playerLimit: number;

  points: number;
}

export interface RoomListed extends Room {
  title: string;
  theme: string;
}

export interface LoginRoom {
  id: number;
  points: number;
  createdAt: Date;
  publicId: string;
  visible: boolean;
  playerLimit: number;
  theme: Theme;
}
