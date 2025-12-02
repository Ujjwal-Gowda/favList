import { Router } from "express";
import { auth } from "../middleware/authware";
import {
  addFavorite,
  getFavorites,
  deleteFavorite,
  checkFavorite,
} from "../controller/favController";
const router = Router();

router.post("/", auth, addFavorite);
router.get("/", auth, getFavorites);
router.delete("/:id", auth, deleteFavorite);
router.get("/", auth, checkFavorite);

router.use((req, res) => {
  console.log("HIT ROUTER:", req.method, req.url);
  res.send("Router loaded");
});
export default router;
