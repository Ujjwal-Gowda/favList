import "dotenv/config";
import { PrismaClient } from "@prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.POOLED_DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
