"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
async function connectDB() {
    try {
        await exports.prisma.$connect();
        console.log("✅ Prisma connected successfully to the database!");
    }
    catch (error) {
        console.error("❌ Failed to connect to the database:", error);
    }
}
connectDB();
exports.default = exports.prisma;
