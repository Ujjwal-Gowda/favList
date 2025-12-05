import z from "zod";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { platform } from "os";
import { title } from "process";
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

    const cleaned = data.items.map((book: any) => ({
      id: book.id,
      title: book.volumeInfo?.title,
      authors: book.volumeInfo?.authors || [],
      publishedDate: book.volumeInfo?.publishedDate,
      description: book.volumeInfo?.description,
      pageCount: book.volumeInfo?.pageCount,
      thumbnail: book.volumeInfo?.imageLinks?.thumbnail || null,
      previewLink: book.volumeInfo?.previewLink,
      categories: book.volumeInfo?.categories || [],
    }));
    return res.json({
      success: true,
      data: cleaned,
      count: cleaned.length,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch books",
      error: err,
    });
  }
};
let twitchtokenCache = {
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
    twitchtokenCache.token = data.access_token;
    twitchtokenCache.expiresAt = Date.now() + data.expires_in * 1000;

    return data.access_token;
  } catch (error) {
    console.error("Twitch token error:", error);
    throw new Error("Failed to authenticate with Twitch");
  }
}

async function getTwitchToken(): Promise<string> {
  if (twitchtokenCache.token && Date.now() < twitchtokenCache.expiresAt) {
    return twitchtokenCache.token;
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
      body: `fields name,cover.image_id,first_release_date,platforms.name,rating,summary; search "${query}"; limit 10;`,
      timeout: 10000,
    });

    if (!igdbResponse.ok) {
      const errorText = await igdbResponse.text();
      console.error("IGDB error:", igdbResponse.status, errorText);
      return res.status(500).json({ error: "Failed to fetch games from IGDB" });
    }

    const games = await igdbResponse.json();
    console.log(games);
    const cleaned = games.map((game: any) => ({
      id: game.id,
      name: game.name,
      image: game.cover?.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
        : null,
      platform: game.platforms?.map((p: any) => p.name) || [],
      rating: game.rating ? Math.round(game.rating) : null,
      summary: game.summary || "",
      first_release_date: game.first_release_date || null,
    }));
    return res.json({
      success: true,
      data: cleaned,
      count: cleaned.length,
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
let spotifytokenCache = {
  token: "",
  expiresAt: 0,
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
    spotifytokenCache.token = data.access_token;
    spotifytokenCache.expiresAt = Date.now() + data.expires_in * 1000;

    return data.access_token;
  } catch (error) {
    console.error("spotify token error:", error);
    throw new Error("Failed to authenticate with spotify");
  }
}

async function getSpotifyToken(): Promise<string> {
  if (spotifytokenCache.token && Date.now() < spotifytokenCache.expiresAt) {
    return spotifytokenCache.token;
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

    const cleaned = songs.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,

      artists: track.artists.map((a: any) => ({
        id: a.id,
        name: a.name,
        url: a.external_urls?.spotify,
      })),

      album: {
        id: track.album?.id,
        name: track.album?.name,
        releaseDate: track.album?.release_date,
        image: track.album?.images?.[0]?.url || null,
        url: track.album?.external_urls?.spotify,
      },

      previewUrl: track.preview_url || null,
      spotifyUrl: track.external_urls?.spotify || null,
    }));
    return res.json({
      success: true,
      data: cleaned,
      count: cleaned.length,
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
    console.log(result);

    const description = result?.description;
    if (!Array.isArray(description)) {
      throw new Error("Invalid API response: description missing");
    }
    console.log(description);

    const cleaned = description.map((movie: any) => ({
      id: movie["#IMDB_ID"],
      imdbID: movie["#IMDB_ID"],

      title: movie["#TITLE"] || "",
      Title: movie["#TITLE"] || "",

      year: movie["#YEAR"],
      Year: movie["#YEAR"]?.toString() || "",

      image: movie["#IMG_POSTER"] || "",
      Poster: movie["#IMG_POSTER"] || "",

      actors: movie["#ACTORS"] || "",
      imdbUrl: movie["#IMDB_URL"] || "",
      rank: movie["#RANK"] ?? null,

      width: movie.photo_width ?? null,
      height: movie.photo_height ?? null,
    }));
    console.log(cleaned);
    return res.json({
      success: true,
      data: cleaned,
      count: cleaned.length,
    });
  } catch (error) {
    console.error("movie search error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const searchUnsplash = async (req: Request, res: Response) => {
  try {
    const query = (req.query.query as string) || "";

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'query' is required",
      });
    }
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=10`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      },
    );

    const data = await response.json();
    console.log(data);
    const cleaned = data.results.map((img: any) => ({
      id: img.id,
      title: img.description,
      description: img.description || img.alt_description,
      url: img.urls?.regular,
      thumb: img.urls?.thumb,
      download: img.urls?.full || img.urls?.raw,
      unsplash: img.links?.html,
      user: {
        name: img.user?.name,
        profile: img.user?.links?.html,
      },
    }));

    return res.json({
      success: true,
      data: cleaned,
      count: cleaned.length,
    });
  } catch (error) {
    console.error("Unsplash error:", error);
    return res.status(500).json({ error: "Failed to fetch Unsplash images" });
  }
};

export const recommendedUnsplash = async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?per_page=10&order_by=popular`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      },
    );

    const data = await response.json();

    const cleaned = data.map((img: any) => ({
      id: img.id,

      title: img.description,
      description: img.description || img.alt_description,
      url: img.urls?.regular,
      thumb: img.urls?.thumb,

      download: img.urls?.full || img.urls?.raw,
      unsplash: img.links?.html,
      user: {
        name: img.user?.name,
        profile: img.user?.links?.html,
      },
    }));
    return res.json({
      success: true,
      data: cleaned,
      count: cleaned.length,
    });
  } catch (error) {
    console.error("Unsplash error:", error);
    return res.status(500).json({ error: "Failed to fetch Unsplash images" });
  }
};
