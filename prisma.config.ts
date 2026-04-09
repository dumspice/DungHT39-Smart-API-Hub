import { defineConfig } from "@prisma/config";
import { getDatabaseUrl } from "./src/config/database";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: getDatabaseUrl(),
  },
});
