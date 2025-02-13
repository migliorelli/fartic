import Room from "@/interfaces/room.interface";
import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
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
  currentWord: {
    type: String,
    required: false,
  },
  currentDrawer: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["waiting", "playing", "finished"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RoomModel = mongoose.model<Room>("Room", RoomSchema);

export default RoomModel;
