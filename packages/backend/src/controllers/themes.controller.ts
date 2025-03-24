import ThemeService from "@/services/theme.service";
import { NextFunction, Request, Response } from "express";

class ThemesController {
  public service = new ThemeService();

  public getThemes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const themesData = await this.service.findAllThemes();
      res.status(200).json({ data: themesData, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getThemeById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const themeId = req.params.id;
      const theme = await this.service.findThemeById(themeId);

      res.status(200).json({ data: theme, message: "findUnique" });
    } catch (error) {
      next(error);
    }
  };

  public createTheme = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const theme = await this.service.createTheme(req.body);
      res.status(200).json({ data: theme, message: "create" });
    } catch (error) {
      next(error);
    }
  };

  public deleteTheme = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const themeId = req.params.id;
      const theme = await this.service.deleteThemeById(themeId);

      res.status(200).json({ data: theme, message: "delete" });
    } catch (error) {
      next(error);
    }
  };

  public addWordsToTheme = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const themeId = req.params.id;
      const words = req.body.word;
      const theme = await this.service.addWordsToTheme(themeId, words);

      res.status(200).json({ data: theme, message: "addWord" });
    } catch (error) {
      next(error);
    }
  };

  public removeWordsFromTheme = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const themeId = req.params.id;
      const words = req.body.word;
      const theme = await this.service.removeWordsFromTheme(themeId, words);

      res.status(200).json({ data: theme, message: "removeWord" });
    } catch (error) {
      next(error);
    }
  };
}

export default ThemesController;
