// src/db/schema.ts
import { pgTable, serial, text, timestamp, varchar, pgEnum, doublePrecision, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// NFT table definition
export const nfts = pgTable("nfts", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull().default("CF"),
    price: doublePrecision("price").notNull().default(0),
    stock: integer("stock").notNull().default(0),
    description: text("description").notNull().default(""),
    tokenId: varchar("token_id", { length: 256 }).notNull().unique(),
    owner: varchar("owner", { length: 256 }).notNull(),
    metadataUri: text("metadata_uri").notNull(),
    assetUri: text("asset_uri").notNull(),
    tokenUri: text("token_uri").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define NFT relations
export const nftsRelations = relations(nfts, ({ many }) => ({
    transactions: many(nftTransactions),
}));

// Define the TransactionType enum for PostgreSQL
export const transactionTypeEnum = pgEnum("transaction_type", ["BUY", "SELL"]);

// NFT Transaction table definition
export const nftTransactions = pgTable("nft_transactions", {
    id: serial("id").primaryKey(),
    transactionHash: varchar("transaction_hash", { length: 256 }).notNull().unique(),
    tokenId: varchar("token_id", { length: 256 }).notNull(),
    buyer: varchar("buyer", { length: 256 }).notNull(),
    seller: varchar("seller", { length: 256 }).notNull(),
    transactionType: transactionTypeEnum("transaction_type").notNull(),
    price: varchar("price", { length: 256 }),  // Optional field
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define NFT Transaction relations
export const nftTransactionsRelations = relations(nftTransactions, ({ one }) => ({
    nft: one(nfts, {
        fields: [nftTransactions.tokenId],
        references: [nfts.tokenId],
    }),
}));

// Types generated from the schema
export type NFT = typeof nfts.$inferSelect;
export type NewNFT = typeof nfts.$inferInsert;
export type NFTTransaction = typeof nftTransactions.$inferSelect;
export type NewNFTTransaction = typeof nftTransactions.$inferInsert;