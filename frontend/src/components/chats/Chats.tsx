import Answers from "./Answers";
import PlayerChat from "./PlayerChat";
import classes from "./Chats.module.css";

const Chats = () => {
  return (
    <div className={classes.chatsRoot}>
      <Answers />
      <div className={classes.line} />
      <PlayerChat />
    </div>
  );
};

export default Chats;
