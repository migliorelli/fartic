import RoomStatus from "@/enums/status.enum";
import Room from "@/interfaces/room.interface";
import mongoose from "mongoose";

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
    status: {
      type: String,
      enum: Object.values(RoomStatus),
      default: RoomStatus.Waiting,
    },
  },
  { timestamps: true },
);

const RoomModel = mongoose.model<Room>("Room", RoomSchema);

export default RoomModel;
