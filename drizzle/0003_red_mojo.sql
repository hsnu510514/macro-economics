CREATE TABLE "indicatorCategories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "indicatorCategories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "indicatorCategories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "relatedIndicators" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "relatedIndicators_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"indicator_id" integer NOT NULL,
	"related_indicator_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "indicatorNotes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "indicatorNotes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"indicator_id" integer NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "indicatorNotes_indicator_id_unique" UNIQUE("indicator_id")
);
--> statement-breakpoint
ALTER TABLE "indicators" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "indicators" ADD COLUMN "meaning" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "indicators" ADD COLUMN "calculation" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "indicators" ADD COLUMN "analystUsage" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "relatedIndicators" ADD CONSTRAINT "relatedIndicators_indicator_id_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatedIndicators" ADD CONSTRAINT "relatedIndicators_related_indicator_id_indicators_id_fk" FOREIGN KEY ("related_indicator_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicatorNotes" ADD CONSTRAINT "indicatorNotes_indicator_id_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_category_id_indicatorCategories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."indicatorCategories"("id") ON DELETE set null ON UPDATE no action;