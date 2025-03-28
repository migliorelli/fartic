import HttpError from "@/errors/http.error";
import Player from "@/interfaces/player.interface";
import { PopulatedRoom } from "@/interfaces/room.interface";
import PlayerModel from "@/models/player.model";
import RoomModel from "@/models/room.model";
import { isEmpty } from "@/utils/util";
import { validateObjectId } from "@/validators/objectid.validator";
import { validateCreatePlayer } from "@/validators/player.validator";
import { Document } from "mongoose";

class PlayerService {
  public model = PlayerModel;
  public roomModel = RoomModel;

  public async findAllPlayers(): Promise<Player[]> {
    const players: Player[] = await this.model.find();
    return players;
  }

  public async findPlayerById(playerId: string): Promise<Player> {
    if (isEmpty(playerId)) throw new HttpError(400, "PlayerId is empty");
    if (!validateObjectId(playerId))
      throw new HttpError(400, "PlayerId is invalid");

    const player: Player | null = await this.model.findOne({ _id: playerId });
    if (!player) throw new HttpError(409, "Player doesn't exist");

    return player;
  }

  public async createPlayer(
    data: Omit<Player, "tag" | "_id">,
  ): Promise<Player> {
    if (!validateCreatePlayer(data))
      throw new HttpError(409, "Invalid player data");

    const player: Omit<Player, "_id"> = {
      ...data,
      tag: await this.model.generateTag(),
    };

    const createdPlayer = await this.model.create(player);
    if (!createdPlayer) throw new HttpError(500, "Error creating player");

    return createdPlayer;
  }

  public async deletePlayerById(playerId: string): Promise<Player> {
    const deletedPlayer: Player | null =
      await this.model.findByIdAndDelete(playerId);
    if (!deletedPlayer) throw new HttpError(409, "Player doesn't exist");

    return deletedPlayer;
  }

  public async deleteMultiplePlayers(ids: string[]): Promise<void> {
    await this.model.deleteMany({ _id: { $in: ids } });
  }

  public async addPlayerToRoomByRoomTag(
    roomTag: string,
    socketId: string,
    username: string,
  ): Promise<{ player: Player; room: PopulatedRoom }> {
    if (isEmpty(roomTag)) throw new HttpError(400, "RoomTag is empty");
    if (isEmpty(socketId)) throw new HttpError(400, "SocketId is empty");
    if (isEmpty(username)) throw new HttpError(400, "Username is empty");

    const room = await this.roomModel.findOne({ tag: roomTag });
    if (!room) throw new HttpError(409, "Room doesn't exist");

    const player: Omit<Player, "_id" | "createdAt" | "updatedAt"> = {
      socketId,
      username,
      score: 0,
      inactiveRounds: 0,
      won: 0,
      tag: await this.model.generateTag(),
      owner: room.players.length === 0,
    };

    const createdPlayer = await this.model.create(player);
    if (!createdPlayer) throw new HttpError(500, "Error creating player");

    room.players.push(createdPlayer.id);
    await room.save();

    const pRoom = await this.model.populate<PopulatedRoom>(room, {
      path: "players theme",
    });

    return {
      room: pRoom,
      player: createdPlayer,
    };
  }

  public async removePlayerFromRoomBySocketId(
    socketId: string,
  ): Promise<{ player: Player; room: PopulatedRoom }> {
    if (isEmpty(socketId)) throw new HttpError(400, "SocketId is empty");

    const rooms = await this.roomModel
      .find()
      .populate<PopulatedRoom & Document>("players");
    const room = rooms.find((r) => {
      return r.players.some((p) => p.socketId === socketId);
    });

    if (!room) throw new HttpError(409, "Room doesn't exist");

    let player: Player | null = null;
    room.players = room.players.filter((p) => {
      if (p.socketId === socketId) {
        player = p;
        return false;
      }
      return true;
    });

    if (player !== null) {
      if ((<Player>player).owner && room.players.length > 0) {
        room.players[0].owner = true;
      }

      await this.deletePlayerById((<Player>player)._id);
    }

    await room.save();

    return {
      room,
      player: player!,
    };
  }
}

export default PlayerService;
