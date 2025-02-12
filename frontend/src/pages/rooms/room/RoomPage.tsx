import Canvas from "@/components/canvas/Canvas";
import Chats from "@/components/chats/Chats";
import PlayerList from "@/components/playerlist/PlayerList";
import { useSocket } from "@/contexts/SocketContext";
import { CircleUserRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import classes from "./RoomPage.module.css";

const RoomPage = () => {
  const { user } = useSocket();
  const navigate = useNavigate();

  const back = () => {
    navigate("/rooms");
  };

  return (
    <div className={classes.roomPageRoot}>
      <div className={classes.controls}>
        <button className={classes.backBtn} onClick={back}>
          <LogOut size={32} />
        </button>
        <div className={classes.user}>
          {user?.username}
          <CircleUserRound size={32} />
        </div>
      </div>
      <div className={classes.containers}>
        <div className={`container ${classes.playerlist}`}>
          <PlayerList />
        </div>
        <div className={`container ${classes.canvas}`}>
          <Canvas />
        </div>
        <div className={`container ${classes.chat}`}>
          <Chats />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
