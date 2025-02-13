import App from "./app";
import PingRoutes from "./routes/ping.routes";
import RoomRoutes from "./routes/room.routes";

const app = new App([new PingRoutes(), new RoomRoutes()]);
app.listen();
