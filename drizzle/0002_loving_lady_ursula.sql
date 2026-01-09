CREATE TYPE "public"."frequency" AS ENUM('Y', 'M', 'D');--> statement-breakpoint
CREATE TABLE "userLayouts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "userLayouts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"layoutKey" varchar(255) NOT NULL,
	"indicatorOrder" json DEFAULT '[]'::json NOT NULL,
	"hiddenIndicators" json DEFAULT '[]'::json NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "userLayouts_layoutKey_unique" UNIQUE("layoutKey")
);
--> statement-breakpoint
CREATE TABLE "syncLogs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "syncLogs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"indicatorCode" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"recordsSynced" integer DEFAULT 0,
	"errorMessage" varchar(1000),
	"runAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "indicators" ADD COLUMN "cName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "indicators" DROP COLUMN "frequency";--> statement-breakpoint
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_code_unique" UNIQUE("code");