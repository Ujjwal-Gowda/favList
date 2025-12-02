import cors from "cors";
import express from "express";
import authRoutes from "./routes/authroute";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import favRoutes from "./routes/favRoutes";
import searchRoutes from "./routes/searchRoutes";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/favorites", favRoutes);

app.listen(5000, () => {
  console.log("server running on http://localhost:5000");
});
