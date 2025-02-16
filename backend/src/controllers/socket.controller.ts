import { AppSocket, SocketClient } from "@/interfaces/socket.interface";
import PlayerService from "@/services/player.service";
import RoomService from "@/services/room.service";

class SocketController {
  public socket: AppSocket;
  roomService = new RoomService();
  playerService = new PlayerService();

  constructor(socket: AppSocket) {
    this.socket = socket;

    this.socket.on("connection", async (client) => {
      client.on("ping", () => client.emit("pong", "pong!"));

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
    client.on("room:join", async (roomTag, username) => {
      try {
        const socketId = client.id.toString();

        const { player, room } =
          await this.playerService.addPlayerToRoomByRoomTag(
            roomTag,
            socketId,
            username,
          );

        const {
          players,
          playerLimit,
          private: _private,
          createdAt,
          updatedAt,
          ...gameRoom
        } = room;

        console.log("dasjkldnjkasjdklsa");
        client.join(roomTag);
        client.nsp.to(roomTag).emit("game:setup", gameRoom, player, players);
        client.nsp.to(roomTag).emit("player:joined", player);
      } catch (error) {
        console.error(
          `SOCKET /rooms room:join => Message: ${(error as Error).message}`,
        );
      }
    });
  }

  private async setupAwser(client: SocketClient) {
    client.on("awser:send", (msg) => {
      client.nsp.to(msg.roomTag).emit("awser:receive", msg);
    });
  }

  private async setupMessage(client: SocketClient) {
    client.on("chat:send", (msg) => {
      client.nsp.to(msg.roomTag).emit("chat:receive", msg);
    });
  }
}

export default SocketController;
