import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL env var is not set. Please configure your Neon PostgreSQL connection string.");
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export * from "./schema";
