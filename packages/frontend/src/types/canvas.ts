import type StrokeType from "../enums/canvas";

export interface Coord {
  x: number;
  y: number;
}

export interface Stroke {
  strokeType: StrokeType;
  fill: boolean;
  lineWidth: number;
  color: string;
  coordinates: Coord[];
  from: Coord;
}
