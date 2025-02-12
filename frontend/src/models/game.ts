export interface Theme {
  id: number;
  name: string;
}

export interface Word {
  id: number;
  content: string;
  themeId: number;
}
