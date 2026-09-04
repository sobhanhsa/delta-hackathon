import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

export const productRepository = {
  list: () => db.select().from(products).all(),
  get: (id: string) => db.select().from(products).where(eq(products.id, id)).get(),
  create: (value: typeof products.$inferInsert) => db.insert(products).values(value).returning().get(),
  update: (id: string, value: Partial<typeof products.$inferInsert>) =>
    db.update(products).set(value).where(eq(products.id, id)).returning().get(),
  remove: (id: string) => db.delete(products).where(eq(products.id, id)).returning().get(),
};
