import Player from "@/interfaces/player.interface";
import mongoose from "mongoose";

interface PlayerModel extends mongoose.Model<Player> {
  generateTag: () => Promise<string>;
}

const PlayerSchema = new mongoose.Schema(
  {
    socketId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    statics: {
      generateTag: async function () {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let tag;
        let isUnique = false;

        while (!isUnique) {
          tag = "#";
          for (let i = 0; i < 8; i++) {
            tag += characters.charAt(
              Math.floor(Math.random() * characters.length),
            );
          }

          const existingPlayer = await this.findOne({ tag });
          if (!existingPlayer) {
            isUnique = true;
          }
        }

        return tag;
      },
    },
  },
);

const PlayerModel = mongoose.model<Player & mongoose.Document, PlayerModel>(
  "Player",
  PlayerSchema,
);

export default PlayerModel;
