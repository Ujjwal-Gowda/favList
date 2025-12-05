import { Request, Response } from "express";
import { prisma } from "../db";
import { z } from "zod";

const addFavoriteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["MUSIC", "MOVIE", "GAME", "BOOK", "ART", "OTHER"]),
  metadata: z.any().optional(),
});

type FavoriteType = z.infer<typeof addFavoriteSchema>;

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const parsed = addFavoriteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: parsed.error,
      });
    }

    const { title, type, metadata } = parsed.data;

    const favorite = await prisma.favorite.create({
      data: { title, type, metadata, userId },
    });

    return res.status(201).json({
      message: "Favorite added!",
      favorite,
    });
  } catch (err) {
    console.error("Add Favorite Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ favorites });
  } catch (err) {
    console.error("Get Favorites Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const favoriteId = req.params.id;
    const userId = req.user!.id;

    const fav = await prisma.favorite.findUnique({
      where: { id: favoriteId },
    });

    if (!fav || fav.userId !== userId) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    await prisma.favorite.delete({
      where: { id: favoriteId },
    });

    return res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error("Delete Favorite Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const checkFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, type } = req.query;

    const exists = await prisma.favorite.findFirst({
      where: {
        userId,
        title: title as string,
        type: type as FavoriteType["type"],
      },
    });

    res.json({ favorited: Boolean(exists), id: exists?.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to check favorite" });
  }
};
