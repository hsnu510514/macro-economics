CREATE TABLE "indicatorMetrics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "indicatorMetrics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"indicator_id" integer NOT NULL,
	"yoy" real NOT NULL,
	"mom" real NOT NULL,
	"qoq" real NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "indicatorValues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "indicatorValues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"indicator_id" integer NOT NULL,
	"date" date NOT NULL,
	"value" numeric NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "indicators" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "indicators_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"frequency" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL,
	"unit" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "indicatorMetrics" ADD CONSTRAINT "indicatorMetrics_indicator_id_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicatorValues" ADD CONSTRAINT "indicatorValues_indicator_id_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicators"("id") ON DELETE cascade ON UPDATE no action;