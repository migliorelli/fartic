import { Player } from "@/models/player";
import { CircleUserRound, Pencil } from "lucide-react";
import classes from "./PlayerButton.module.css";

interface PlayerButtonProps {
  player: Player;
  onClick: () => void;
  me: boolean;
  drawing: boolean;
}

const PlayerButton = ({ player, onClick, me, drawing }: PlayerButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${me && classes.me} ${classes.playerBtn} ${drawing && classes.drawing}`}
    >
      <div className={classes.infos}>
        <CircleUserRound size={40} className={classes.photo} />
        <div>
          <div className={classes.username}>{player.username}</div>
          <div className={classes.points}>{player.points} points</div>
        </div>
      </div>
      <div className={classes.tokens}>
        {drawing && <Pencil className={classes.drawing} />}
      </div>
    </button>
  );
};

export default PlayerButton;
