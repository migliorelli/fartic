import Routes from "@/interfaces/routes.interface";
import { Router } from "express";

class PingRoutes implements Routes {
  public path?: string;
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/ping", (res, req) => {
      req.status(200).json({ message: "pong!" });
    });
  }
}

export default PingRoutes;
