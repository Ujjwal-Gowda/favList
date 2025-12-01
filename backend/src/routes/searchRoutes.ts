import { Router } from "express";
import { auth } from "../middleware/authware";
import {
  searchBook,
  gameSearch,
  songSearch,
} from "../controller/searchController";
const router = Router();
router.get("/book/:name", auth, searchBook);
router.get("/game", auth, gameSearch);
router.get("/music", auth, songSearch);
export default router;
