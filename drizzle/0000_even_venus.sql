CREATE TABLE "nfts" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" varchar(256) NOT NULL,
	"owner" varchar(256) NOT NULL,
	"metadata_uri" text NOT NULL,
	"asset_uri" text NOT NULL,
	"token_uri" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nfts_token_id_unique" UNIQUE("token_id")
);
