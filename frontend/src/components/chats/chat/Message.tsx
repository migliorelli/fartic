import { Message as MessageType } from "@/models/message";
import classes from "./Message.module.css";

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  return (
    <li className={`${classes.messageContainer} ${classes[message.type]}`}>
      <b className={classes.title}>{message.title}</b>
      <span className={classes.content}> {message.content}</span>
    </li>
  );
};

export default Message;
