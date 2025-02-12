import { Request, Response } from "express";
import prisma from "../utils/prisma";

const validateThemeInput = (themes: { name: string }[]) => {
  if (!Array.isArray(themes) || themes.some((theme) => !theme.name.trim())) {
    throw new Error(
      "Invalid theme data. All themes must have a non-empty name.",
    );
  }
};

export const createTheme = async (
  req: Request<{}, {}, { name: string }>,
  res: Response,
) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Theme name is required." });
  }

  try {
    const theme = await prisma.theme.create({
      data: { name: name.trim() },
    });

    return res.status(200).json(theme);
  } catch (error) {
    console.error("Error creating theme:", error);
    return res.status(500).json({ message: "Failed to create theme." });
  }
};

export const createMultipleThemes = async (
  req: Request<{}, {}, { themes: { name: string }[] }>,
  res: Response,
) => {
  const { themes } = req.body;

  try {
    validateThemeInput(themes);

    const createdThemes = await prisma.theme.createMany({
      data: themes.map((theme) => ({ name: theme.name.trim() })),
      skipDuplicates: true,
    });

    return res.status(200).json(createdThemes);
  } catch (error) {
    console.error("Error creating multiple themes:", error);
    const err = error as any;
    
    if (
      err.message ===
      "Invalid theme data. All themes must have a non-empty name."
    ) {
      return res.status(400).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Failed to create multiple themes." });
  }
};

export const getAllThemes = async (_: Request, res: Response) => {
  try {
    const themes = await prisma.theme.findMany();

    return res.status(200).json(themes);
  } catch (error) {
    console.error("Error retrieving themes:", error);
    return res.status(500).json({ message: "Failed to get themes." });
  }
};
