// @ts-nocheck

import { Router } from "express";
import {
  createMultipleWords,
  createWord,
  getAllWords,
} from "../controllers/word-controller";

const wordRoutes = Router();

wordRoutes.post("/create", createWord);
wordRoutes.post("/create/multiples", createMultipleWords);

wordRoutes.get("/getall", getAllWords);

export default wordRoutes;
