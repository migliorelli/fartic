import HttpError from "@/errors/http.error";
import PlayerService from "@/services/player.service";
import { validateCreatePlayer } from "@/validators/player.validator";
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

  public getPlayer = async (
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
      if (!validateCreatePlayer(req.body))
        throw new HttpError(409, "Invalid player data");

      const player = this.service.createPlayer(req.body);
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
