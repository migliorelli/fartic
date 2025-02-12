import { useSocket } from "@/contexts/SocketContext";
import PlayerButton from "./PlayerButton";
import classes from "./PlayerList.module.css";

const PlayerList = () => {
  const { user, players } = useSocket();

  const handlePlayerClick = () => {};

  return (
    <div className={classes.playerList}>
      {players.map((player, index) => (
        <PlayerButton
          player={player}
          key={player.id}
          onClick={handlePlayerClick}
          drawing={index == 1}
          me={player.id === user?.id}
        />
      ))}
    </div>
  );
};
export default PlayerList;
