import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { capacity } from "@/lib/db/schema";
export const capacityRepository = {
  list: () => db.select().from(capacity).all(),
  get: (id: number) => db.select().from(capacity).where(eq(capacity.id, id)).get(),
  create: (value: typeof capacity.$inferInsert) => db.insert(capacity).values(value).returning().get(),
  update: (id: number, value: Partial<typeof capacity.$inferInsert>) => db.update(capacity).set(value).where(eq(capacity.id, id)).returning().get(),
};
