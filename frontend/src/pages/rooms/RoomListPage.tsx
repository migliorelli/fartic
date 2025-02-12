import CreateRoomModal from "@/components/create-room/CreateRoomModal";
import Room from "@/components/room-list/Room";
import { useUsername } from "@/contexts/UsernameContext";
import useAxios from "@/hooks/use-axios";
import { Room as RoomType } from "@/models/rooms";
import { CircleUserRound, RotateCw } from "lucide-react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import classes from "./RoomListPage.module.css";

const RoomListPage = () => {
  const { data, refetch, loading } = useAxios<RoomType[]>("/rooms/getall");
  const { username, logout } = useUsername();

  // refetch every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  if (username === null) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`container ${classes.roomListRoot}`}>
      <div className={classes.header}>
        <h1 style={{ marginRight: "auto" }}>Rooms</h1>
        <CreateRoomModal />
        <button className="btn btn-icon" disabled={loading} onClick={refetch}>
          <RotateCw />
        </button>
      </div>
      <div className={classes.rooms}>
        {data && data.map((room) => <Room key={room.publicId} room={room} />)}
      </div>
      <div className={classes.footer}>
        <button className="btn btn-outline" onClick={handleLogout}>
          Logout
        </button>
        <div className={classes.user}>
          {username}
          <CircleUserRound size={32} />
        </div>
      </div>
    </div>
  );
};

export default RoomListPage;
