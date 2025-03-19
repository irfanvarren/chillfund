// src/db/queries.ts
import { eq, and, desc, isNotNull } from "drizzle-orm";
import { db } from "./"; // Assuming you have a db connection file
import { nfts, nftTransactions, type NFT, type NewNFT, type NFTTransaction, type NewNFTTransaction } from "./schema";

// ========== NFT QUERIES ==========

// INSERT: Create a new NFT
export async function createNFT(data: NewNFT): Promise<NFT> {
    const result = await db.insert(nfts).values(data).returning();
    return result[0];
}

// SELECT: Get all NFTs
export async function getAllNFTs(): Promise<NFT[]> {
    return await db.select().from(nfts).orderBy(desc(nfts.createdAt));
}

// SELECT: Get NFT by ID
export async function getNFTById(id: number): Promise<NFT | undefined> {
    const result = await db.select().from(nfts).where(eq(nfts.id, id));
    return result[0];
}

// SELECT: Get NFT by tokenId
export async function getNFTByTokenId(tokenId: string): Promise<NFT | undefined> {
    const result = await db.select().from(nfts).where(eq(nfts.tokenId, tokenId));
    return result[0];
}

// SELECT: Get NFTs by owner
export async function getNFTsByOwner(ownerAddress: string): Promise<NFT[]> {
    return await db.select().from(nfts).where(eq(nfts.owner, ownerAddress));
}

// UPDATE: Update NFT
export async function updateNFT(id: number, data: Partial<NewNFT>): Promise<NFT | undefined> {
    const result = await db.update(nfts)
        .set(data)
        .where(eq(nfts.id, id))
        .returning();
    return result[0];
}

// UPDATE: Change NFT owner
export async function transferNFT(tokenId: string, newOwner: string): Promise<NFT | undefined> {
    const result = await db.update(nfts)
        .set({ owner: newOwner })
        .where(eq(nfts.tokenId, tokenId))
        .returning();
    return result[0];
}

// DELETE: Delete NFT
export async function deleteNFT(id: number): Promise<boolean> {
    const result = await db.delete(nfts).where(eq(nfts.id, id)).returning();
    return result.length > 0;
}

// ========== NFT TRANSACTION QUERIES ==========

// INSERT: Create a new NFT Transaction
export async function createNFTTransaction(data: NewNFTTransaction): Promise<NFTTransaction> {
    const result = await db.insert(nftTransactions).values(data).returning();
    return result[0];
}

// SELECT: Get all NFT Transactions
export async function getAllNFTTransactions(): Promise<NFTTransaction[]> {
    return await db.select().from(nftTransactions).orderBy(desc(nftTransactions.createdAt));
}

// SELECT: Get NFT Transaction by ID
export async function getNFTTransactionById(id: number): Promise<NFTTransaction | undefined> {
    const result = await db.select().from(nftTransactions).where(eq(nftTransactions.id, id));
    return result[0];
}

// SELECT: Get NFT Transaction by hash
export async function getNFTTransactionByHash(hash: string): Promise<NFTTransaction | undefined> {
    const result = await db.select().from(nftTransactions).where(eq(nftTransactions.transactionHash, hash));
    return result[0];
}

// SELECT: Get transactions for a specific NFT
export async function getTransactionsByTokenId(tokenId: string): Promise<NFTTransaction[]> {
    return await db.select()
        .from(nftTransactions)
        .where(eq(nftTransactions.tokenId, tokenId))
        .orderBy(desc(nftTransactions.createdAt));
}

// SELECT: Get transactions by buyer or seller
export async function getTransactionsByAddress(address: string): Promise<NFTTransaction[]> {
    return await db.select()
        .from(nftTransactions)
        .where(
            and(
                eq(nftTransactions.buyer, address),
                eq(nftTransactions.seller, address)
            )
        )
        .orderBy(desc(nftTransactions.createdAt));
}

// SELECT: Get transactions by type
export async function getTransactionsByType(type: "BUY" | "SELL"): Promise<NFTTransaction[]> {
    return await db.select()
        .from(nftTransactions)
        .where(eq(nftTransactions.transactionType, type))
        .orderBy(desc(nftTransactions.createdAt));
}

// UPDATE: Update NFT Transaction
export async function updateNFTTransaction(id: number, data: Partial<NewNFTTransaction>): Promise<NFTTransaction | undefined> {
    const result = await db.update(nftTransactions)
        .set(data)
        .where(eq(nftTransactions.id, id))
        .returning();
    return result[0];
}

// DELETE: Delete NFT Transaction
export async function deleteNFTTransaction(id: number): Promise<boolean> {
    const result = await db.delete(nftTransactions).where(eq(nftTransactions.id, id)).returning();
    return result.length > 0;
}

// ========== ADVANCED QUERIES ==========

// Get NFT with its transactions
export async function getNFTWithTransactions(tokenId: string): Promise<{ nft: NFT | undefined, transactions: NFTTransaction[] }> {
    const nft = await getNFTByTokenId(tokenId);
    const transactions = await getTransactionsByTokenId(tokenId);

    return {
        nft,
        transactions
    };
}

// Get recent sales with price data
export async function getRecentSales(limit: number = 10): Promise<NFTTransaction[]> {
    return await db.select()
        .from(nftTransactions)
        .where(
            and(
                eq(nftTransactions.transactionType, "SELL"),
                isNotNull(nftTransactions.price) // Only include transactions with price data
            )
        )
        .orderBy(desc(nftTransactions.createdAt))
        .limit(limit);
}