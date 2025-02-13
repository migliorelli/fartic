import Room from "@/interfaces/room.interface";
import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: String,
  players: [
    {
      socketId: String,
      username: String,
      score: { type: Number, default: 0 },
    },
  ],
  currentWord: { type: String, required: false },
  currentDrawer: { type: String, required: false },
  status: {
    type: String,
    enum: ["waiting", "playing", "finished"],
    default: "waiting",
  },
  createdAt: { type: Date, default: Date.now },
});

const RoomModel = mongoose.model<Room & mongoose.Document>("Room", RoomSchema);

export default RoomModel;
