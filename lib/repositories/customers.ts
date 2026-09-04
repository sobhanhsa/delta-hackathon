import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";

export const customerRepository = {
  list: () => db.select().from(customers).all(),
  get: (id: string) => db.select().from(customers).where(eq(customers.id, id)).get(),
  create: (value: typeof customers.$inferInsert) => db.insert(customers).values(value).returning().get(),
  update: (id: string, value: Partial<typeof customers.$inferInsert>) =>
    db.update(customers).set(value).where(eq(customers.id, id)).returning().get(),
  remove: (id: string) => db.delete(customers).where(eq(customers.id, id)).returning().get(),
};
