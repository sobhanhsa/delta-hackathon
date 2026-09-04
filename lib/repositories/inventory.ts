import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventory } from "@/lib/db/schema";

export const inventoryRepository = {
  list: () => db.select().from(inventory).all(),
  get: (productId: string) => db.select().from(inventory).where(eq(inventory.productId, productId)).get(),
  upsert: (value: typeof inventory.$inferInsert) =>
    db.insert(inventory).values(value).onConflictDoUpdate({ target: inventory.productId, set: value }).returning().get(),
};
