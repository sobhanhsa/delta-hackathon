import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { alerts } from "@/lib/db/schema";
export const alertRepository = {
  list: () => db.select().from(alerts).orderBy(desc(alerts.createdAt)).all(),
  acknowledge: (id: string) => db.update(alerts).set({ acknowledgedAt: new Date().toISOString() }).where(eq(alerts.id, id)).returning().get(),
  upsert: (value: typeof alerts.$inferInsert) => db.insert(alerts).values(value).onConflictDoUpdate({ target: alerts.id, set: value }).returning().get(),
};
