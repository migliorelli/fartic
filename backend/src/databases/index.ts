import mongoose from "mongoose";
import { DB_DATABASE, DB_HOST, DB_PORT } from "../config";

export const DBMongoose: { url: string; options: mongoose.ConnectOptions } = {
  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {},
};
