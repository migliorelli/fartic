import Theme from "@/interfaces/theme.interface";
import mongoose from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      dropDups: true,
    },
    words: [{ type: String }],
  },
  { timestamps: true },
);

const ThemeModel = mongoose.model<Theme>("Theme", ThemeSchema);

export default ThemeModel;
