import {
  integer,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";
import { indicators } from "./indicators";

export const relatedIndicators = pgTable("relatedIndicators", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicator_id: integer("indicator_id")
    .notNull()
    .references(() => indicators.id, {
      onDelete: "cascade",
      onUpdate: "no action",
    }),
  related_indicator_id: integer("related_indicator_id")
    .notNull()
    .references(() => indicators.id, {
      onDelete: "cascade",
      onUpdate: "no action",
    }),
  createdAt: timestamp().defaultNow(),
});
