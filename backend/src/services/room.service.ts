import HttpError from "@/errors/http.error";
import Room, { PopulatedRoom } from "@/interfaces/room.interface";
import RoomModel from "@/models/room.model";
import { isEmpty } from "@/utils/util";
import { validateObjectId } from "@/validators/objectid.validator";
import { validateCreateRoom } from "@/validators/room.validator";
import { Document } from "mongoose";
import PlayerService from "./player.service";
import ThemeService from "./theme.service";

class RoomService {
  public model = RoomModel;
  public themeService = new ThemeService();
  public playerService = new PlayerService();

  public async findAllRooms(): Promise<PopulatedRoom[]> {
    const rooms: PopulatedRoom[] = await this.model
      .find()
      .populate<PopulatedRoom>("players theme");

    return rooms;
  }

  public async findAllPublicRooms(): Promise<PopulatedRoom[]> {
    const rooms: PopulatedRoom[] = await this.model
      .find({ private: false })
      .populate<PopulatedRoom>("players theme");

    return rooms;
  }

  public async findRoomByTag(roomTag: string): Promise<PopulatedRoom> {
    if (isEmpty(roomTag)) throw new HttpError(400, "RoomTag is empty");

    const room: PopulatedRoom | null = await this.model
      .findOne({ tag: roomTag })
      .populate<PopulatedRoom>("players theme");

    if (!room) throw new HttpError(409, "Room doesn't exist");

    return room;
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

    const theme = await this.themeService.findThemeById(String(data.theme));
    const tag = await this.model.generateTag();
    const name = `${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)} #${tag}`;

    const room = await this.model.create({ ...data, name, tag });
    const populatedRoom = await this.model.populate<PopulatedRoom>(room, {
      path: "players theme",
    });

    return populatedRoom;
  }

  public async deleteRoomById(roomId: string): Promise<PopulatedRoom> {
    if (isEmpty(roomId)) throw new HttpError(400, "RoomId is empty");
    if (!validateObjectId(roomId))
      throw new HttpError(400, "RoomId is invalid");

    const room = await this.model
      .findById(roomId)
      .populate<PopulatedRoom & Document>("players theme");
    if (!room) throw new HttpError(409, "Room doesn't exist");

    if (room.players && room.players.length > 0) {
      await this.playerService.deleteMultiplePlayers(
        room.players.map((p) => p._id),
      );
    }

    await room.deleteOne();
    return room;
  }
}

export default RoomService;
