import { pgTable, integer, text, boolean } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  description: text("description"),
  done: boolean("done").default(false).notNull(),
});
