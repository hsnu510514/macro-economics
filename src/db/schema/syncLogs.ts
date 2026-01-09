import {
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const syncLogs = pgTable("syncLogs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicatorCode: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 50 }).notNull(), // 'success' | 'error'
  recordsSynced: integer().default(0),
  errorMessage: varchar({ length: 1000 }),
  runAt: timestamp().defaultNow(),
});
