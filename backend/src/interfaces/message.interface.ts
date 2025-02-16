import MessageType from "@/enums/message.enum";

interface Message {
  roomTag: string;
  title: string;
  content: string;
  type: MessageType;
}

export default Message;
