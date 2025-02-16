import MessageType from "@/enums/message.enum";
import { AppSocket, SocketClient } from "@/interfaces/socket.interface";
import PlayerService from "./player.service";
import RoomService from "./room.service";

class SocketService {
  public socket: AppSocket;
  roomService = new RoomService();
  playerService = new PlayerService();

  constructor(socket: AppSocket) {
    this.socket = socket;

    this.socket.of("/game").on("connection", async (client) => {
      this.setupConnection(client);
      this.setupRooms(client);
      this.setupAwser(client);
      this.setupMessage(client);
    });
  }

  private async setupConnection(client: SocketClient) {
    client.on("disconnect", async () => {
      try {
        const socketId = client.id.toString();

        const { room } =
          await this.playerService.removePlayerFromRoomBySocketId(socketId);

        client.nsp.to(room._id).emit("player:left", socketId);
      } catch (error) {
        console.error(
          `SOCKET /rooms disconnect => Message: ${(error as Error).message}`,
        );
      }
    });
  }

  private async setupRooms(client: SocketClient) {
    client.on("room:join", async (roomId, username) => {
      try {
        const socketId = client.id.toString();

        const { player, room } =
          await this.playerService.addPlayerToRoomByRoomTag(
            roomTag,
            socketId,
            username,
          );

        client.join(roomId);
        client.nsp
          .to(roomId)
          .emit("player:joined", socketId, username, player.tag);
      } catch (error) {
        console.error(
          `SOCKET /rooms room:join => Message: ${(error as Error).message}`,
        );
      }
    });
  }

  private async setupAwser(client: SocketClient) {
    client.on("awser:send", (roomId, username, content) => {
      client.nsp
        .to(roomId)
        .emit("awser:receive", roomId, username, content, MessageType.Message);
    });
  }

  private async setupMessage(client: SocketClient) {
    client.on("chat:send", (roomId, username, content) => {
      client.nsp
        .to(roomId)
        .emit("chat:receive", roomId, username, content, MessageType.Message);
    });
  }
}

export default SocketService;
