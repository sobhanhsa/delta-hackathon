import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
export const orderRepository = {
  list: () => db.select().from(orders).all(),
  create: (value: typeof orders.$inferInsert) => db.insert(orders).values(value).returning().get(),
};
