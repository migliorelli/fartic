import Chat from "./chat/Chat";

const AnswersChat = () => {
  return <Chat emit="sendAnswer" listen="answer" placeholder="Answer" />;
};

export default AnswersChat;
