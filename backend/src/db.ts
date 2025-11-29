import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected successfully to the database!");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
  }
}

connectDB();

export default prisma;
