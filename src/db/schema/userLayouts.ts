import {
  integer,
  json,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userLayouts = pgTable("userLayouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  layoutKey: varchar({ length: 255 }).unique().notNull(),
  indicatorOrder: json().$type<number[]>().notNull().default([]),
  hiddenIndicators: json().$type<number[]>().notNull().default([]),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
