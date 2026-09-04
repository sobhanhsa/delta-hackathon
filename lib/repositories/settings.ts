import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";

export const settingsRepository = {
  get: () => db.select().from(settings).where(eq(settings.id, 1)).get(),
  upsert: (value: Omit<typeof settings.$inferInsert, "id">) =>
    db.insert(settings).values({ id: 1, ...value }).onConflictDoUpdate({ target: settings.id, set: value }).returning().get(),
};
