import App from "./app";
import RoomRoutes from "./routes/room.routes";

const app = new App([new RoomRoutes()]);
app.listen();
