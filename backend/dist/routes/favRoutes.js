"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authware_1 = require("../middleware/authware");
const favController_1 = require("../controller/favController");
const router = (0, express_1.Router)();
router.post("/", authware_1.auth, favController_1.addFavorite);
router.get("/", authware_1.auth, favController_1.getFavorites);
router.delete("/:id", authware_1.auth, favController_1.deleteFavorite);
router.get("/", authware_1.auth, favController_1.checkFavorite);
router.use((req, res) => {
    console.log("HIT ROUTER:", req.method, req.url);
    res.send("Router loaded");
});
exports.default = router;
