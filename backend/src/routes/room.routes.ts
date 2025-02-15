import RoomsController from "@/controllers/rooms.controller";
import Routes from "@/interfaces/routes.interface";
import { Router } from "express";

class RoomRoutes implements Routes {
  public path = "/rooms";
  public router = Router();
  public roomsController = new RoomsController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}`, this.roomsController.getRooms);
    this.router.get(`${this.path}/public`, this.roomsController.getPublicRooms);
    this.router.get(`${this.path}/:id`, this.roomsController.getRoomById);
    this.router.get(`${this.path}/tag/:tag`, this.roomsController.getRoomByTag);
    this.router.post(`${this.path}`, this.roomsController.createRoom);
    this.router.delete(`${this.path}/:id`, this.roomsController.deleteRoom);
  }
}

export default RoomRoutes;
