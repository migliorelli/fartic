import { HttpError } from "@/errors/http.error";
import RoomService from "@/services/room.service";
import { validateCreateRoom } from "@/validators/room.validator";
import { NextFunction, Request, Response } from "express";

export default class RoomsController {
  public service = new RoomService();

  public async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const roomsData = await this.service.findAllRooms();
      res.status(200).json({ data: roomsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  }

  public async getRoomById(req: Request, res: Response, next: NextFunction) {
    try {
      const roomId = req.params.id;
      const room = await this.service.findRoomById(roomId);

      res.status(200).json({ data: room, message: "findUnique" });
    } catch (error) {
      next(error);
    }
  }

  public async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateCreateRoom(req.body))
        throw new HttpError(409, "Invalid room data");

      const createdRoom = this.service.createRoom(req.body);
    } catch (error) {
      next(error);
    }
  }
}
