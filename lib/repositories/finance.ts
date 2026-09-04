import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cash } from "@/lib/db/schema";
export const financeRepository = {
  get: () => db.select().from(cash).where(eq(cash.id, 1)).get(),
  upsert: (value: typeof cash.$inferInsert) => db.insert(cash).values({ id: 1, ...value }).onConflictDoUpdate({ target: cash.id, set: value }).returning().get(),
};
