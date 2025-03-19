CREATE TYPE "public"."transaction_type" AS ENUM('BUY', 'SELL');--> statement-breakpoint
CREATE TABLE "nft_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_hash" varchar(256) NOT NULL,
	"token_id" varchar(256) NOT NULL,
	"buyer" varchar(256) NOT NULL,
	"seller" varchar(256) NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"price" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nft_transactions_transaction_hash_unique" UNIQUE("transaction_hash")
);
