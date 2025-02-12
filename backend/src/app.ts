import cors from "cors";
import express, { json } from "express";
import http from "http";
import { Server } from "socket.io";
import roomRoutes from "./routes/room-routes";
import themeRoutes from "./routes/theme-routes";
import wordRoutes from "./routes/word-routes";
import { setupSocket } from "./services/socket-service";

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" /*"http://localhost:5173"*/ },
});

app.use(cors({ origin: "*" /*"http://localhost:5173"*/ }));
app.use(json());

app.use("/rooms", roomRoutes);
app.use("/words", wordRoutes);
app.use("/themes", themeRoutes);

server.listen(PORT, () => {
  console.log(`Server running on on port`, PORT);
});

setupSocket(io);
