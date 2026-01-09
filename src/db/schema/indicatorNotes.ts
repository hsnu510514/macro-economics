import {
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { indicators } from "./indicators";

export const indicatorNotes = pgTable("indicatorNotes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicator_id: integer("indicator_id")
    .notNull()
    .unique()
    .references(() => indicators.id, {
      onDelete: "cascade",
      onUpdate: "no action",
    }),
  content: text().notNull().default(""),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
