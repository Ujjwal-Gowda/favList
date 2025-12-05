"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const authroute_1 = __importDefault(require("./routes/authroute"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const favRoutes_1 = __importDefault(require("./routes/favRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://fav-list-chi.vercel.app/"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "4mb" }));
app.use(express_1.default.urlencoded({ limit: "4mb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/auth", authroute_1.default);
app.use("/search", searchRoutes_1.default);
app.use("/favorites", favRoutes_1.default);
app.listen(5000, () => {
    console.log("server running on http://localhost:5000");
});
