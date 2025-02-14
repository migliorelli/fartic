import App from "./app";
import PingRoutes from "./routes/ping.routes";
import PlayerRoutes from "./routes/player.routes";
import RoomRoutes from "./routes/room.routes";
import ThemeRoutes from "./routes/theme.routes";

const routes = [
  new PingRoutes(),
  new RoomRoutes(),
  new PlayerRoutes(),
  new ThemeRoutes(),
];

const app = new App(routes);
app.listen();
