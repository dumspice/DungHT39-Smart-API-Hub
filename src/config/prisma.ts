import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter } as any);

export const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};
