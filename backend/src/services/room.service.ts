import HttpError from "@/errors/http.error";
import Player from "@/interfaces/player.interface";
import Room from "@/interfaces/room.interface";
import RoomModel from "@/models/room.model";
import { isEmpty } from "@/utils/util";

class RoomService {
  public model = RoomModel;

  public async findAllRooms(): Promise<Room[]> {
    const rooms: Room[] = await this.model.find();
    return rooms;
  }

  public async findRoomById(roomId: string): Promise<Room> {
    if (isEmpty(roomId)) throw new HttpError(400, "RoomId is empty");

    const room: Room | null = await this.model.findOne({ _id: roomId });
    if (!room) throw new HttpError(409, "Room doesn't exist");

    return room;
  }

  public async createRoom(data: Partial<Room>): Promise<Room> {
    const roomsQuantity = await this.model.countDocuments();
    const name = `Room ${roomsQuantity + 1}`;

    const room: Room = await this.model.create({ ...data, name });
    return room;
  }

  public async deleteRoom(roomId: string): Promise<Room> {
    const deletedRoom: Room | null = await this.model.findByIdAndDelete(roomId);
    if (!deletedRoom) throw new HttpError(409, "Room doesn't exist");

    return deletedRoom;
  }

  public async addPlayerToRoomByRoomId(
    roomId: string,
    socketId: string,
    username: string,
  ): Promise<{ player: Player; room: Room }> {
    if (isEmpty(roomId)) throw new HttpError(400, "RoomId is empty");
    if (isEmpty(socketId)) throw new HttpError(400, "SocketId is empty");
    if (isEmpty(username)) throw new HttpError(400, "Username is empty");

    const room = await this.model.findOne({ _id: roomId });
    if (!room) throw new HttpError(409, "Room doesn't exist");

    const player: Player = {
      socketId,
      username,
      score: 0,
    };

    room.players.push(player);

    await room.save();

    return {
      room,
      player,
    };
  }

  public async removePlayerFromRoomBySocketId(
    socketId: string,
  ): Promise<{ player: Player; room: Room }> {
    if (isEmpty(socketId)) throw new HttpError(400, "SocketId is empty");

    const room = await this.model.findOne({ "players.socketId": socketId });
    if (!room) throw new HttpError(409, "Room doesn't exist");

    let player = null;
    room.players = room.players.filter((p) => {
      if (p.socketId === socketId) {
        player = p;
        return false;
      }
      return true;
    });

    await room.save();

    return {
      room,
      player: player!,
    };
  }
}

export default RoomService;
