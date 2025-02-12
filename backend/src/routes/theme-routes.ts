// @ts-nocheck

import { Router } from "express";
import {
  createMultipleThemes,
  createTheme,
  getAllThemes,
} from "../controllers/theme-controller";

const themeRoutes = Router();

themeRoutes.post("/create", createTheme);
themeRoutes.post("/create/multiples", createMultipleThemes);

themeRoutes.get("/getall", getAllThemes);

export default themeRoutes;
