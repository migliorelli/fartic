import PlayersController from "@/controllers/players.controller";
import Routes from "@/interfaces/routes.interface";
import { Router } from "express";

class PlayerRoutes implements Routes {
  public path = "/players";
  public router = Router();
  public playersController = new PlayersController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}`, this.playersController.getPlayers);
    this.router.get(`${this.path}/:id`, this.playersController.getPlayer);
    this.router.post(`${this.path}`, this.playersController.createPlayer);
  }
}

export default PlayerRoutes;
