import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
export const eventRepository = {
  list: () => db.select().from(events).orderBy(desc(events.occurredAt)).all(),
  append: (value: typeof events.$inferInsert) => db.insert(events).values(value).returning().get(),
};
