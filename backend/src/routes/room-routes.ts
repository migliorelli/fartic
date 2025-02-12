// @ts-nocheck

import { Router } from "express";
import {
  createRoom,
  getAllRooms,
  getRoomByPublicId,
} from "../controllers/room-controller";

const roomRoutes = Router();

roomRoutes.post("/create", createRoom);

roomRoutes.get("/getall", getAllRooms);
roomRoutes.get("/publicid/:publicId", getRoomByPublicId);

export default roomRoutes;
