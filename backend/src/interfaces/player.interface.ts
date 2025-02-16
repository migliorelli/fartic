interface Player {
  _id: string;
  socketId: string;
  username: string;
  score: number;
  tag: string;
  updatedAt: Date;
  createdAt: Date;
}

export default Player;
