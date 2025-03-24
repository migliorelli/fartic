export enum StrokeType {
  Eraser = "ERASER",
  Dash = "DASH",

  Square = "SQUARE",
  Circle = "CIRCLE",

  Triangle = "TRIANGLE",
  HalfTriangle = "HALFTRIANGLE",

  Line = "LINE",
  PaintBucket = "PAINTBUCKET",
}

interface Coord {
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
