import RoomStatus from "@/enums/status.enum";
import { StrokeType } from "@/interfaces/canvas.interface";
import Room from "@/interfaces/room.interface";
import mongoose from "mongoose";

interface RoomModel extends mongoose.Model<Room> {
  generateTag: () => Promise<string>;
}

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
    },
    images: [
      {
        fill: Boolean,
        lineWidth: Number,
        color: String,
        coordinates: [{ x: Number, y: Number }],
        from: { x: Number, y: Number },
        strokeType: {
          type: String,
          enum: Object.values(StrokeType),
          default: StrokeType.Dash,
        },
      },
    ],
    currentWord: {
      type: String,
      required: false,
    },
    targetPontuation: {
      type: Number,
      required: true,
      default: 120,
    },
    private: {
      type: Boolean,
      required: true,
      default: false,
    },
    playerLimit: {
      type: Number,
      required: true,
      default: 8,
    },
    currentDrawer: {
      type: String,
      required: false,
    },
    tag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      length: 4,
    },
    status: {
      type: String,
      enum: Object.values(RoomStatus),
      default: RoomStatus.Waiting,
    },
  },
  {
    timestamps: true,
    statics: {
      generateTag: async function () {
        const characters =
          "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
        let tag;
        let isUnique = false;

        while (!isUnique) {
          tag = "";
          for (let i = 0; i < 4; i++) {
            tag += characters.charAt(
              Math.floor(Math.random() * characters.length),
            );
          }

          const existingRoom = await this.findOne({ tag });
          if (!existingRoom) {
            isUnique = true;
          }
        }

        return tag;
      },
    },
  },
);

const RoomModel = mongoose.model<Room, RoomModel>("Room", RoomSchema);

export default RoomModel;
