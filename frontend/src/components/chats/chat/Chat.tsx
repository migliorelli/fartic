import { EmitEvents, ListenEvents, useSocket } from "@/contexts/SocketContext";
import { Message } from "@/models/message";
import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import classes from "./Chat.module.css";
import { renderMessage as defaultRenderMessage } from "./render-message";

interface ChatProps {
  listen: keyof ListenEvents;
  emit: keyof EmitEvents;
  placeholder: string;
  renderMessage?: (message: Message, index: number) => ReactNode;
}

const Chat = ({
  emit,
  listen,
  placeholder,
  renderMessage = defaultRenderMessage,
}: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLUListElement | null>(null);

  const { socket, user } = useSocket();
  const { publicId } = useParams();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    socket?.emit(emit, publicId!, user!.id, message);
    setMessage("");
  };

  useEffect(() => {
    socket?.on(listen, (title, content, type) => {
      setMessages((prev) => [...prev, { title, content, type }]);
    });

    return () => {
      socket?.off(listen);
    };
  }, [socket, listen]);

  useEffect(() => {
    chatRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  return (
    <div className={classes.chatRoot}>
      <ul className={classes.chat} ref={chatRef}>
        {messages.map(renderMessage)}
      </ul>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          className={`input ${classes.input}`}
          value={message}
          onChange={handleChange}
          placeholder={placeholder}
        />
      </form>
    </div>
  );
};

export default Chat;
