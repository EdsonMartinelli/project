import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "path";

dotenv.config({
  path: path.join(import.meta.dirname, "/.env.development"),
  quiet: true,
  debug: false,
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
