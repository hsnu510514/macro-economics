import {
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const indicatorCategories = pgTable("indicatorCategories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).unique().notNull(),
  createdAt: timestamp().defaultNow(),
});
