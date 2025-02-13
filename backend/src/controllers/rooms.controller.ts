import HttpError from "@/errors/http.error";
import RoomService from "@/services/room.service";
import { validateCreateRoom } from "@/validators/room.validator";
import { NextFunction, Request, Response } from "express";

class RoomsController {
  public service = new RoomService();

  public getRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roomsData = await this.service.findAllRooms();
      res.status(200).json({ data: roomsData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getRoomById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const roomId = req.params.id;
      const room = await this.service.findRoomById(roomId);

      res.status(200).json({ data: room, message: "findUnique" });
    } catch (error) {
      next(error);
    }
  };

  public createRoom = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!validateCreateRoom(req.body))
        throw new HttpError(409, "Invalid room data");

      const room = this.service.createRoom(req.body);
      res.status(200).json({ data: room, message: "create" });
    } catch (error) {
      next(error);
    }
  };

  public deleteRoom = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const roomId = req.params.id;
      const room = await this.service.deleteRoomById(roomId);

      res.status(200).json({ data: room, message: "delete" });
    } catch (error) {
      next(error);
    }
  };
}

export default RoomsController;
