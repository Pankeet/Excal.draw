import "dotenv/config";
import { defineConfig } from "prisma/config";
import { DATABASE_URL } from "@repo/backend-secret/dist";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL
  },
});
