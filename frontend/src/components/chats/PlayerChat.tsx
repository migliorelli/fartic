import Chat from "./chat/Chat";

const PlayerChat = () => {
  return <Chat emit="sendMessage" listen="message" placeholder="Message" />;
};

export default PlayerChat;
