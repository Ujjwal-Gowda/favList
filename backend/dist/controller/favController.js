"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFavorite = exports.deleteFavorite = exports.getFavorites = exports.addFavorite = void 0;
const db_1 = require("../db");
const zod_1 = require("zod");
const addFavoriteSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    type: zod_1.z.enum(["MUSIC", "MOVIE", "GAME", "BOOK", "ART", "OTHER"]),
    metadata: zod_1.z.any().optional(),
});
const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const parsed = addFavoriteSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid data",
                errors: parsed.error,
            });
        }
        const { title, type, metadata } = parsed.data;
        const favorite = await db_1.prisma.favorite.create({
            data: { title, type, metadata, userId },
        });
        return res.status(201).json({
            message: "Favorite added!",
            favorite,
        });
    }
    catch (err) {
        console.error("Add Favorite Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.addFavorite = addFavorite;
const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await db_1.prisma.favorite.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return res.json({ favorites });
    }
    catch (err) {
        console.error("Get Favorites Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFavorites = getFavorites;
const deleteFavorite = async (req, res) => {
    try {
        const favoriteId = req.params.id;
        const userId = req.user.id;
        const fav = await db_1.prisma.favorite.findUnique({
            where: { id: favoriteId },
        });
        if (!fav || fav.userId !== userId) {
            return res.status(404).json({ message: "Favorite not found" });
        }
        await db_1.prisma.favorite.delete({
            where: { id: favoriteId },
        });
        return res.json({ message: "Favorite removed" });
    }
    catch (err) {
        console.error("Delete Favorite Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteFavorite = deleteFavorite;
const checkFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, type } = req.query;
        const exists = await db_1.prisma.favorite.findFirst({
            where: {
                userId,
                title: title,
                type: type,
            },
        });
        res.json({ favorited: Boolean(exists), id: exists?.id });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to check favorite" });
    }
};
exports.checkFavorite = checkFavorite;
