import { config } from "dotenv";

config();

export const {
  NODE_ENV,
  PORT,
  VERSION,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  ORIGIN,
} = process.env;
