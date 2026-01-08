import { time } from "console";
import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  real,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const frequencyEnum = pgEnum("frequency", ["Y", "M", "D"]);

export const indicators = pgTable("indicators", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  code: varchar({ length: 255 }).unique().notNull(),
  name: varchar({ length: 255 }).notNull(),
  cName: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  source: varchar({ length: 255 }).notNull(),
  unit: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const indicatorValues = pgTable("indicatorValues", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicator_id: integer("indicator_id")
    .notNull() // foreign key column usually not null
    .references(() => indicators.id, {
      onDelete: "cascade", // optional: specify ON DELETE action
      onUpdate: "no action", // optional: specify ON UPDATE action
    }),
  date: date().notNull(),
  value: numeric().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const indicatorMetrics = pgTable("indicatorMetrics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicator_id: integer("indicator_id")
    .notNull() // foreign key column usually not null
    .references(() => indicators.id, {
      onDelete: "cascade", // optional: specify ON DELETE action
      onUpdate: "no action", // optional: specify ON UPDATE action
    }),
  yoy: real().notNull(),
  mom: real().notNull(),
  qoq: real().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
