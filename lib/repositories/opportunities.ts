import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { opportunities } from "@/lib/db/schema";

export const opportunityRepository = {
  list: () => db.select().from(opportunities).all(),
  get: (id: string) => db.select().from(opportunities).where(eq(opportunities.id, id)).get(),
  create: (value: typeof opportunities.$inferInsert) => db.insert(opportunities).values(value).returning().get(),
  update: (id: string, value: Partial<typeof opportunities.$inferInsert>) =>
    db.update(opportunities).set(value).where(eq(opportunities.id, id)).returning().get(),
  remove: (id: string) => db.delete(opportunities).where(eq(opportunities.id, id)).returning().get(),
};
