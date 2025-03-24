import MessageType from "@/enums/message.enum";
import { GameRoom } from "@/interfaces/room.interface";
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
      this.setupGame(client);
      this.setupRooms(client);
      this.setupCanvas(client);
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

        if (room.players.length === 0) {
          await this.roomService.deleteRoomById(room._id);
        }

        client.nsp.to(room._id).emit("players", room.players);
      } catch (error) {
        console.error(
          `SOCKET disconnect => Message: ${(error as Error).message}`,
        );
      }
    });
  }

  private async setupGame(client: SocketClient) {
    client.on("game:start", async (roomTag) => {
      try {
        const { word, player } = await this.roomService.startRound(roomTag);

        client.emit("game:round-drawer", word);
        client.nsp.to(roomTag).except(player.socketId).emit("game:round");
      } catch (error) {
        console.error(
          `SOCKET game:start => Message: ${(error as Error).message}`,
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

        const gameRoom: GameRoom = {
          _id: room._id,
          name: room.name,
          status: room.status,
          tag: room.tag,
          targetPontuation: room.targetPontuation,
          theme: room.theme,
          currendDrawer: room.currendDrawer,
          currentWord: room.currentWord,
          images: room.images,
        };

        client.join(roomTag);
        client.nsp
          .to(roomTag)
          .emit("game:setup", gameRoom, player, room.players);
        client.nsp.to(roomTag).emit("players", room.players);
        client.nsp.to(roomTag).emit("chat:receive", {
          content: "joined",
          title: `${player.username}#${player.tag}`,
          type: MessageType.Server,
          roomTag,
        });
      } catch (error) {
        console.error(
          `SOCKET room:join => Message: ${(error as Error).message}`,
        );
      }
    });

    client.on("room:leave", async () => {
      try {
        const socketId = client.id.toString();

        const { room } =
          await this.playerService.removePlayerFromRoomBySocketId(socketId);

        if (room.players.length === 0) {
          await this.roomService.deleteRoomById(room._id);
        }

        client.nsp.to(room._id).emit("players", room.players);
      } catch (error) {
        console.error(
          `SOCKET room:leave => Message: ${(error as Error).message}`,
        );
      }
    });
  }

  private async setupAwser(client: SocketClient) {
    client.on("awser:send", (msg) => {
      client.nsp.to(msg.roomTag).emit("awser:receive", msg);
      console.log("AWSER:RECEIVE:", msg);
    });
  }

  private async setupMessage(client: SocketClient) {
    client.on("chat:send", (msg) => {
      client.nsp.to(msg.roomTag).emit("chat:receive", msg);
    });
  }

  private async setupCanvas(client: SocketClient) {
    client.on("canvas:send", async (roomTag, images) => {
      try {
        await this.roomService.updateRoomImage(roomTag, images);
        client.nsp.to(roomTag).except(client.id).emit("canvas:receive", images);
      } catch (error) {
        console.error(
          `SOCKET canvas:send => Message: ${(error as Error).message}`,
        );
      }
    });
  }
}

export default SocketController;
