interface Player {
  _id: string;
  socketId: string;
  username: string;
  score: number;
  tag: string;
  owner: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export default Player;
