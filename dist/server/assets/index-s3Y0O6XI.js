import { pgTable, timestamp, varchar, integer, pgEnum, text, numeric, date, real, json } from "drizzle-orm/pg-core";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
const indicatorCategories = pgTable("indicatorCategories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).unique().notNull(),
  createdAt: timestamp().defaultNow()
});
const frequencyEnum = pgEnum("frequency", ["Y", "M", "D"]);
const indicators = pgTable("indicators", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  code: varchar({ length: 255 }).unique().notNull(),
  name: varchar({ length: 255 }).notNull(),
  cName: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  category_id: integer("category_id").references(() => indicatorCategories.id, {
    onDelete: "set null",
    onUpdate: "no action"
  }),
  source: varchar({ length: 255 }).notNull(),
  unit: varchar({ length: 255 }).notNull(),
  meaning: text().default(""),
  calculation: text().default(""),
  analystUsage: text().default(""),
  createdAt: timestamp().defaultNow()
});
const indicatorValues = pgTable("indicatorValues", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicator_id: integer("indicator_id").notNull().references(() => indicators.id, {
    onDelete: "cascade",
    // optional: specify ON DELETE action
    onUpdate: "no action"
    // optional: specify ON UPDATE action
  }),
  date: date().notNull(),
  value: numeric().notNull(),
  createdAt: timestamp().defaultNow()
});
const indicatorMetrics = pgTable("indicatorMetrics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicator_id: integer("indicator_id").notNull().references(() => indicators.id, {
    onDelete: "cascade",
    // optional: specify ON DELETE action
    onUpdate: "no action"
    // optional: specify ON UPDATE action
  }),
  yoy: real().notNull(),
  mom: real().notNull(),
  qoq: real().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => /* @__PURE__ */ new Date())
});
const relatedIndicators = pgTable("relatedIndicators", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicator_id: integer("indicator_id").notNull().references(() => indicators.id, {
    onDelete: "cascade",
    onUpdate: "no action"
  }),
  related_indicator_id: integer("related_indicator_id").notNull().references(() => indicators.id, {
    onDelete: "cascade",
    onUpdate: "no action"
  }),
  createdAt: timestamp().defaultNow()
});
const indicatorNotes = pgTable("indicatorNotes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicator_id: integer("indicator_id").notNull().unique().references(() => indicators.id, {
    onDelete: "cascade",
    onUpdate: "no action"
  }),
  content: text().notNull().default(""),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => /* @__PURE__ */ new Date())
});
const userLayouts = pgTable("userLayouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  layoutKey: varchar({ length: 255 }).unique().notNull(),
  indicatorOrder: json().$type().notNull().default([]),
  hiddenIndicators: json().$type().notNull().default([]),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => /* @__PURE__ */ new Date())
});
const syncLogs = pgTable("syncLogs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indicatorCode: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 50 }).notNull(),
  // 'success' | 'error'
  recordsSynced: integer().default(0),
  errorMessage: varchar({ length: 1e3 }),
  runAt: timestamp().defaultNow()
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  frequencyEnum,
  indicatorCategories,
  indicatorMetrics,
  indicatorNotes,
  indicatorValues,
  indicators,
  relatedIndicators,
  syncLogs,
  userLayouts
}, Symbol.toStringTag, { value: "Module" }));
const db = drizzle(process.env.DATABASE_URL, { schema });
export {
  indicatorMetrics as a,
  indicators as b,
  indicatorNotes as c,
  db as d,
  indicatorValues as i,
  relatedIndicators as r,
  syncLogs as s,
  userLayouts as u
};
