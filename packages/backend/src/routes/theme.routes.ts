import ThemesController from "@/controllers/themes.controller";
import Routes from "@/interfaces/routes.interface";
import { Router } from "express";

class ThemeRoutes implements Routes {
  public path = "/themes";
  public router = Router();
  public themesController = new ThemesController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}`, this.themesController.getThemes);
    this.router.get(`${this.path}/:id`, this.themesController.getThemeById);
    this.router.post(`${this.path}`, this.themesController.createTheme);
    this.router.delete(`${this.path}/:id`, this.themesController.deleteTheme);
    
    this.router.put(
      `${this.path}/:id/words/add`,
      this.themesController.addWordsToTheme,
    );

    this.router.put(
      `${this.path}/:id/words/remove`,
      this.themesController.removeWordsFromTheme,
    );
  }
}

export default ThemeRoutes;
