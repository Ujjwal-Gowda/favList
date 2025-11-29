import cors from "cors";
import express from "express";
import authRoutes from "./routes/authroute";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use("/auth", authRoutes);
app.listen(5000, () => {
  console.log("server running on http://localhost:5000");
});
