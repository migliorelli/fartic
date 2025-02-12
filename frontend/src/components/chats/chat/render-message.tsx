import { Message as MessageType } from "@/models/message";
import Message from "./Message";

export const renderMessage = (message: MessageType, index: number) => (
  <Message message={message} key={index} />
);
