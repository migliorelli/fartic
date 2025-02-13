import HttpError from "@/errors/http.error";
import Room, { PopulatedRoom } from "@/interfaces/room.interface";
import RoomModel from "@/models/room.model";
import { isEmpty } from "@/utils/util";
import { validateObjectId } from "@/validators/objectid.validator";

class RoomService {
  public model = RoomModel;

  public async findAllRooms(): Promise<PopulatedRoom[]> {
    const rooms: PopulatedRoom[] = await this.model
      .find()
      .populate<PopulatedRoom>("players");

    return rooms;
  }

  public async findRoomById(roomId: string): Promise<PopulatedRoom> {
    if (isEmpty(roomId)) throw new HttpError(400, "RoomId is empty");
    if (!validateObjectId(roomId))
      throw new HttpError(400, "RoomId is invalid");

    const room: PopulatedRoom | null = await this.model
      .findOne({ _id: roomId })
      .populate<PopulatedRoom>("players");

    if (!room) throw new HttpError(409, "Room doesn't exist");

    return room;
  }

  public async createRoom(data: Partial<Room>): Promise<Room> {
    const roomsQuantity = await this.model.countDocuments();
    const name = `Room ${roomsQuantity + 1}`;

    const room: Room = await this.model.create({ ...data, name });
    return room;
  }

  public async deleteRoomById(roomId: string): Promise<Room> {
    const deletedRoom: Room | null = await this.model.findByIdAndDelete(roomId);
    if (!deletedRoom) throw new HttpError(409, "Room doesn't exist");

    return deletedRoom;
  }
}

export default RoomService;
