import { RoomListed } from "@/models/rooms";
import { Clock, Trophy, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import classes from "./Room.module.css";

interface RoomProps {
  room: RoomListed;
}

const Room = ({ room }: RoomProps) => {
  const navigate = useNavigate();

  const now = new Date();
  const createdAt = new Date(room.createdAt);
  const msDiff = now.getTime() - createdAt.getTime();
  const minDiff = Math.floor(msDiff / 1000 / 60);

  const handleClick = () => {
    navigate(`/rooms/${room.publicId}`);
  };

  return (
    <button className={classes.room} onClick={handleClick}>
      <div className={classes.roomHeader}>
        <h2>{room.title}</h2>
        <span>
          {room.theme[0].toUpperCase()}
          {room.theme.substring(1)}
        </span>
      </div>
      <div className={classes.roomDetails}>
        <div className={classes.roomDetailItem}>
          <User size={28} />
          <span>
            {room.playerCount}/{room.playerLimit}
          </span>
        </div>
        <div className={classes.roomDetailItem}>
          <Trophy size={28} />
          <span>{room.points}</span>
        </div>
        <div className={classes.roomDetailItem}>
          <Clock size={28} />
          <span>{minDiff}′</span>
        </div>
      </div>
    </button>
  );
};

export default Room;
