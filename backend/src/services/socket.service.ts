import MessageType from "@/enums/message.enum";
import { AppSocket, SocketClient } from "@/interfaces/socket.interface";
import RoomService from "./room.service";

export default class SocketService {
  public socket: AppSocket;
  roomService = new RoomService();

  constructor(socket: AppSocket) {
    this.socket = socket;

    this.socket.of("/room").on("connection", async (client) => {
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
          await this.roomService.removePlayerFromRoomBySocketId(socketId);

        client.nsp.to(room._id).emit("player:left", socketId);
      } catch (error) {
        console.error(
          `Error on SocketService.setupConnection.disconnect: ${error}`,
        );
      }
    });
  }

  private async setupRooms(client: SocketClient) {
    client.on("room:join", async (roomId, username) => {
      try {
        const socketId = client.id.toString();

        await this.roomService.addPlayerToRoomByRoomId(
          roomId,
          socketId,
          username,
        );

        client.join(roomId);
        client.nsp.to(roomId).emit("player:joined", socketId, username);
      } catch (error) {
        console.error(`Error on SocketService.setupRooms.room-join: ${error}`);
      }
    });
  }

  private async setupAwser(client: SocketClient) {
    client.on("awser:send", (roomId, username, content) => {
      client.nsp
        .to(roomId)
        .emit("awser:receive", roomId, username, content, MessageType.MESSAGE);
    });
  }

  private async setupMessage(client: SocketClient) {
    client.on("chat:send", (roomId, username, content) => {
      client.nsp
        .to(roomId)
        .emit("chat:receive", roomId, username, content, MessageType.MESSAGE);
    });
  }
}
