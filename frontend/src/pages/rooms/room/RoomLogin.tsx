import LoginForm from "@/components/login-form/LoginForm";
import { useUsername } from "@/contexts/UsernameContext";
import { Room } from "@/models/rooms";
import { Clock, Trophy, User } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import classes from "./RoomLogin.module.css";

const RoomLogin = () => {
  const [username, setUsername] = useState("");
  const { login } = useUsername();
  const data = useLoaderData();
  const room = data as Room;

  const now = new Date();
  const createdAt = new Date(room.createdAt);
  const msDiff = now.getTime() - createdAt.getTime();
  const minDiff = Math.floor(msDiff / 1000 / 60);

  const handleSubmit = () => {
    if (username.trim().length > 0) {
      login(username);
    }
  };

  return (
    <div>
      <div className={`container ${classes.roomLoginContainer}`}>
        <div className={classes.roomInfo}>
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
        </div>
        <LoginForm
          onChange={(value) => setUsername(value)}
          onSubmit={handleSubmit}
          username={username}
        />
      </div>
    </div>
  );
};

export default RoomLogin;
