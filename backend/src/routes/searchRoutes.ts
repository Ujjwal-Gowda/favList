import { Router } from "express";
import { auth } from "../middleware/authware";
import { searchBook, gameSearch } from "../controller/searchController";
const router = Router();
router.get("/book/:name", auth, searchBook);
router.get("/game", auth, gameSearch);
export default router;
