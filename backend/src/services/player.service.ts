import HttpError from "@/errors/http.error";
import Player from "@/interfaces/player.interface";
import Room, { PopulatedRoom } from "@/interfaces/room.interface";
import PlayerModel from "@/models/player.model";
import RoomModel from "@/models/room.model";
import { isEmpty } from "@/utils/util";
import { validateObjectId } from "@/validators/objectid.validator";

class PlayerService {
  public model = PlayerModel;
  public roomModel = RoomModel;

  public async findAllPlayers(): Promise<Player[]> {
    const rooms: Player[] = await this.model.find();
    return rooms;
  }

  public async findPlayerById(playerId: string): Promise<Player> {
    if (isEmpty(playerId)) throw new HttpError(400, "PlayerId is empty");
    if (!validateObjectId(playerId))
      throw new HttpError(400, "PlayerId is invalid");

    const room: Player | null = await this.model.findOne({ _id: playerId });
    if (!room) throw new HttpError(409, "Player doesn't exist");

    return room;
  }

  public async createPlayer(
    data: Omit<Player, "tag" | "_id">,
  ): Promise<Player> {
    const player: Omit<Player, "_id"> = {
      ...data,
      tag: await this.model.generateTag(),
    };

    const createdPlayer = await this.model.create(player);
    if (!createdPlayer) throw new HttpError(500, "Error creating user");

    return createdPlayer;
  }

  public async addPlayerToRoomByRoomId(
    roomId: string,
    socketId: string,
    username: string,
  ): Promise<{ player: Player; room: Room }> {
    if (isEmpty(roomId)) throw new HttpError(400, "RoomId is empty");
    if (isEmpty(socketId)) throw new HttpError(400, "SocketId is empty");
    if (isEmpty(username)) throw new HttpError(400, "Username is empty");
    if (!validateObjectId(roomId))
      throw new HttpError(400, "RoomId is invalid");

    const room = await this.roomModel.findOne({ _id: roomId });
    if (!room) throw new HttpError(409, "Room doesn't exist");

    const player: Omit<Player, "_id"> = {
      socketId,
      username,
      score: 0,
      tag: await this.model.generateTag(),
    };

    const createdPlayer = await this.model.create(player);
    if (!createdPlayer) throw new HttpError(500, "Error creating user");

    room.players.push(createdPlayer.id);
    await room.save();

    return {
      room,
      player: createdPlayer,
    };
  }

  public async removePlayerFromRoomBySocketId(
    socketId: string,
  ): Promise<{ player: Player; room: PopulatedRoom }> {
    if (isEmpty(socketId)) throw new HttpError(400, "SocketId is empty");
    if (!validateObjectId(socketId))
      throw new HttpError(400, "SocketId is invalid");

    const room = await this.roomModel
      .findOne({ "players.socketId": socketId })
      .populate<PopulatedRoom>("players");
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
      await this.model.findByIdAndDelete((player as Player)._id);
    }

    await room.save();

    return {
      room,
      player: player!,
    };
  }
}

export default PlayerService;
