import App from "./app";
import PingRoutes from "./routes/ping.routes";
import PlayerRoutes from "./routes/player.routes";
import RoomRoutes from "./routes/room.routes";

const app = new App([new PingRoutes(), new RoomRoutes(), new PlayerRoutes()]);
app.listen();
