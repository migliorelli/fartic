import { getRoomByPublicId } from "@/actions/room";
import AppLayout from "@/pages/AppLayout";
import ErrorPage from "@/pages/ErrorPage";
import LoginPage from "@/pages/LoginPage";
import RoomListPage from "@/pages/rooms/RoomListPage";
import RoomsLayout from "@/pages/rooms/RoomsLayout";
import RoomLayout from "@/pages/rooms/room/RoomLayout";
import { createBrowserRouter, LoaderFunction } from "react-router-dom";

const roomLoader: LoaderFunction = async ({ params }) => {
  const { publicId } = params;

  if (!publicId) {
    throw new Error("Room ID is required.");
  }

  try {
    const room = await getRoomByPublicId(publicId);

    if (room?.error) {
      throw new Error("Room not found.");
    }

    return room?.room;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
      {
        path: "rooms",
        element: <RoomsLayout />,
        children: [
          {
            path: "",
            element: <RoomListPage />,
          },
          {
            path: ":publicId",
            element: <RoomLayout />,
            loader: roomLoader,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
