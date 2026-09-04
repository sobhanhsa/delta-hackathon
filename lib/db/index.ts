import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL ?? "./data/delta.db";
if (databaseUrl !== ":memory:") mkdirSync(dirname(databaseUrl), { recursive: true });
const sqlite = new Database(databaseUrl);
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
