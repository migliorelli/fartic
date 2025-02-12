import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const createWord = async (
  req: Request<{}, {}, { content: string; themeId: number }>,
  res: Response,
) => {
  const { content, themeId } = req.body;

  if (!content || typeof themeId !== "number") {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    const word = await prisma.word.create({
      data: { content, themeId },
    });

    return res.status(200).json(word);
  } catch (error) {
    console.error("Error creating word:", error);
    return res.status(500).json({ message: "Failed to create word." });
  }
};

export const createMultipleWords = async (
  req: Request<{}, {}, { words: { content: string; themeId: number }[] }>,
  res: Response,
) => {
  const { words } = req.body;

  if (
    !Array.isArray(words) ||
    words.some((word) => !word.content || typeof word.themeId !== "number")
  ) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    const response = await prisma.$transaction(async (prismaTx) => {
      const createdWords = [];

      for (const word of words) {
        const createdWord = await prisma.word.create({
          data: word,
        });

        createdWords.push(createdWord);
      }

      return {
        words: createdWords,
      };
    });

    return res.status(200).json(response.words);
  } catch (error) {
    console.error("Error creating words:", error);
    return res.status(500).json({ message: "Failed to create words." });
  }
};

export const getAllWords = async (_: Request, res: Response) => {
  try {
    const words = await prisma.word.findMany({
      include: {
        theme: {},
      },
    });

    return res.status(200).json(words);
  } catch (error) {
    console.error("Error retrieving words:", error);
    return res.status(500).json({ message: "Failed to get words." });
  }
};
