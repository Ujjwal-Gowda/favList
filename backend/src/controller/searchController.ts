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

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function fetchTwitchToken(): Promise<string> {
  const url = "https://id.twitch.tv/oauth2/token";

  const params = new URLSearchParams();
  params.append("client_id", process.env.TWITCH_CLIENT_ID!);
  params.append("client_secret", process.env.TWITCH_CLIENT_SECRET!);
  params.append("grant_type", "client_credentials");

  const res = await fetch(url, { method: "POST", body: params });

  if (!res.ok) {
    console.error("TOKEN ERROR:", await res.text());
    throw new Error("Failed Twitch Authentication");
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

async function getValidToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  return await fetchTwitchToken();
}

export const gameSearch = async (req: any, res: any) => {
  const query = req.query.query;
  console.log(query);
  console.log("CLIENT:", process.env.TWITCH_CLIENT_ID);
  console.log("SECRET:", process.env.TWITCH_CLIENT_SECRET);

  if (!query) {
    return res.status(400).json({ error: "Query parameter required" });
  }

  const token = await getValidToken();

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: `
      fields name, cover.url, first_release_date, platforms.name, rating, summary;
      search "${query}";
      limit 10;
    `,
  });

  if (!response.ok) {
    const error = await response.text();
    console.log("IGDB ERROR:", error);
    return res.status(500).json({ error: "Failed to fetch from IGDB" });
  }

  const data = await response.json();
  return res.json(data);
};
