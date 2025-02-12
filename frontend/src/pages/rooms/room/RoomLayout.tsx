import SocketProvider from "@/contexts/SocketContext";
import { useUsername } from "@/contexts/UsernameContext";
import { Navigate, useParams } from "react-router-dom";
import RoomLogin from "./RoomLogin";
import RoomPage from "./RoomPage";

const RoomLayout = () => {
  const { username } = useUsername();
  const { publicId } = useParams();

  if (!publicId) {
    return <Navigate to="/" />;
  }

  if (!username) {
    return <RoomLogin />;
  }

  return (
    <SocketProvider publicId={publicId} username={username}>
      <RoomPage />
    </SocketProvider>
  );
};

export default RoomLayout;
