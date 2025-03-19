ALTER TABLE "nfts" ADD COLUMN "name" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "nfts" ADD COLUMN "price" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "nfts" ADD COLUMN "stock" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "nfts" ADD COLUMN "description" text NOT NULL;