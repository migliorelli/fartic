import PlayerService from "@/services/player.service";
import { NextFunction, Request, Response } from "express";

class PlayersController {
  public service = new PlayerService();

  public getPlayers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const playerData = await this.service.findAllPlayers();
      res.status(200).json({ data: playerData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getPlayerById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const playerId = req.params.id;
      const player = await this.service.findPlayerById(playerId);

      res.status(200).json({ data: player, message: "findUnique" });
    } catch (error) {
      next(error);
    }
  };

  public createPlayer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const player = await this.service.createPlayer(req.body);
      res.status(200).json({ data: player, message: "create" });
    } catch (error) {
      next(error);
    }
  };

  public deletePlayer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const playerId = req.params.id;
      const player = await this.service.deletePlayerById(playerId);

      res.status(200).json({ data: player, message: "delete" });
    } catch (error) {
      next(error);
    }
  };
}

export default PlayersController;
