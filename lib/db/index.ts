import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = path.join(process.cwd(), "data", "app.db");
mkdirSync(path.dirname(dbPath), { recursive: true });

function createClient() {
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema });
}

export type Db = ReturnType<typeof createClient>;

// Cache the client across Next.js dev HMR reloads.
const globalForDb = globalThis as unknown as { __db?: Db };

export const db: Db = globalForDb.__db ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__db = db;
}

export { schema };
