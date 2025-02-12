import { Request, Response } from "express";
import prisma from "../utils/prisma";

interface CreateRoomBody {
  themeId: number;
  visible: boolean;
  points: number;
  playerLimit: number;
}

export const createRoom = async (
  req: Request<{}, {}, CreateRoomBody>,
  res: Response,
) => {
  const { themeId, visible, points, playerLimit } = req.body;

  if (
    !themeId ||
    typeof themeId !== "number" ||
    typeof visible !== "boolean" ||
    typeof points !== "number" ||
    typeof playerLimit !== "number"
  ) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    const newRoom = await prisma.room.create({
      data: {
        themeId,
        visible,
        points,
        playerLimit,
      },
    });

    return res.status(200).json(newRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create room." });
  }
};

export const getAllRooms = async (_: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { users: true, owner: true, theme: {} },
      where: { visible: true },
    });

    const formattedRooms = rooms.map((room) => ({
      publicId: room.publicId,
      title: room.owner?.username
        ? `${room.owner.username}'s room`
        : "Empty room",
      createdAt: room.createdAt,
      playerCount: room.users.length,
      playerLimit: room.playerLimit,
      theme: room.theme.name,
      points: room.points,
    }));

    return res.status(200).json(formattedRooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get rooms." });
  }
};

export const getRoomByPublicId = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  const { publicId } = req.params;

  if (!publicId || typeof publicId !== "string") {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    const room = await prisma.room.findUnique({
      where: { publicId },
      include: { users: true, owner: true, theme: {} },
    });

    const formattedRoom = {
      publicId: room?.publicId,
      title: room?.owner?.username
        ? `${room?.owner.username}'s room`
        : "Empty room",
      createdAt: room?.createdAt,
      playerCount: room?.users.length,
      playerLimit: room?.playerLimit,
      theme: room?.theme.name,
      points: room?.points,
    };

    return res.status(200).json(formattedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get room." });
  }
};
