import z from "zod";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const bookschema = z.object({
  name: z.string().min(1, "Title is required"),
});
export const searchBook = async (req: Request, res: Response) => {
  const parsed = bookschema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: parsed.error,
    });
  }

  const { name } = parsed.data;

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(name)}`,
    );

    const data = await response.json();

    return res.json({
      message: "Success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch books",
      error: err,
    });
  }
};
let tokenCache = {
  token: "",
  expiresAt: 0,
};

async function fetchTwitchToken(): Promise<string> {
  try {
    const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    });

    if (!response.ok) {
      throw new Error(`Twitch auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    tokenCache.token = data.access_token;
    tokenCache.expiresAt = Date.now() + data.expires_in * 1000;

    return data.access_token;
  } catch (error) {
    console.error("Twitch token error:", error);
    throw new Error("Failed to authenticate with Twitch");
  }
}

async function getTwitchToken(): Promise<string> {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  return fetchTwitchToken();
}

export const gameSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const token = await getTwitchToken();

    const igdbResponse = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: `fields name,cover.url,first_release_date,platforms.name,rating,summary; search "${query}"; limit 10;`,
      timeout: 10000,
    });

    if (!igdbResponse.ok) {
      const errorText = await igdbResponse.text();
      console.error("IGDB error:", igdbResponse.status, errorText);
      return res.status(500).json({ error: "Failed to fetch games from IGDB" });
    }

    const games = await igdbResponse.json();

    return res.json({
      success: true,
      data: games,
      count: games.length,
    });
  } catch (error) {
    console.error("Game search error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Twitch")) {
        return res.status(503).json({ error: error.message });
      }
    }

    return res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? String(error)
          : "Unable to search games",
    });
  }
};

async function fetchSpotifyToken(): Promise<string> {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT}&client_secret=${process.env.SPOTIFY_SECRET}`,
    });

    if (!response.ok) {
      throw new Error(`spotify auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    tokenCache.token = data.access_token;
    tokenCache.expiresAt = Date.now() + data.expires_in * 1000;

    return data.access_token;
  } catch (error) {
    console.error("spotify token error:", error);
    throw new Error("Failed to authenticate with spotify");
  }
}

async function getSpotifyToken(): Promise<string> {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  return fetchSpotifyToken();
}

export const songSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const token = await getSpotifyToken();

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query,
    )}&type=track,album,artist&limit=10`;

    const spotifyResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!spotifyResponse.ok) {
      const errorText = await spotifyResponse.text();
      console.error("spotify error:", spotifyResponse.status, errorText);
      return res
        .status(500)
        .json({ error: "failed to fetch music from spotify" });
    }

    const songs = await spotifyResponse.json();

    return res.json({
      success: true,
      data: songs,
      count: songs.length,
    });
  } catch (error) {
    console.error("music search error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const movieSearch = async (req: Request, res: Response) => {
  const movie = req.query.query as string;
  console.log(movie);
  try {
    if (!movie) {
      return res.status(400).json({ error: "movie name is required" });
    }
    const data = await fetch(
      `https://imdb.iamidiotareyoutoo.com/search?q=${movie}`,
      {
        method: "GET",
      },
    );
    if (!data.ok) {
      const errorText = await data.text();
      console.error("spotify error:", data.status, errorText);
      return res.status(500).json({ error: "failed to fetch movie" });
    }
    const result = await data.json();
    return res.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error("movie search error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
