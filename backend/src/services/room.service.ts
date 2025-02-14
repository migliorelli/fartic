import HttpError from "@/errors/http.error";
import Room, { PopulatedRoom } from "@/interfaces/room.interface";
import RoomModel from "@/models/room.model";
import { isEmpty } from "@/utils/util";
import { validateObjectId } from "@/validators/objectid.validator";
import { validateCreateRoom } from "@/validators/room.validator";

class RoomService {
  public model = RoomModel;

  public async findAllRooms(): Promise<PopulatedRoom[]> {
    const rooms: PopulatedRoom[] = await this.model
      .find()
      .populate<PopulatedRoom>("players theme");

    return rooms;
  }

  public async findRoomById(roomId: string): Promise<PopulatedRoom> {
    if (isEmpty(roomId)) throw new HttpError(400, "RoomId is empty");
    if (!validateObjectId(roomId))
      throw new HttpError(400, "RoomId is invalid");

    const room: PopulatedRoom | null = await this.model
      .findOne({ _id: roomId })
      .populate<PopulatedRoom>("players theme");

    if (!room) throw new HttpError(409, "Room doesn't exist");

    return room;
  }

  public async createRoom(data: Partial<Room>): Promise<PopulatedRoom> {
    if (!validateCreateRoom(data))
      throw new HttpError(409, "Invalid room data");

    const roomsQuantity = await this.model.countDocuments();
    const name = `Room ${roomsQuantity + 1}`;

    const room = await this.model.create({ ...data, name });
    const populatedRoom = await this.model.populate<PopulatedRoom>(room, {
      path: "players theme",
    });

    return populatedRoom;
  }

  public async deleteRoomById(roomId: string): Promise<PopulatedRoom> {
    const deletedRoom: PopulatedRoom | null = await this.model
      .findByIdAndDelete(roomId)
      .populate<PopulatedRoom>("players theme");

    if (!deletedRoom) throw new HttpError(409, "Room doesn't exist");

    return deletedRoom;
  }
}

export default RoomService;
