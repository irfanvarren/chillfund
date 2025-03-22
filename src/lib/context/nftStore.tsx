'use client'
import { NFT } from "@/db/schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultNFT: NFT = {
    id: 0,
    name: "",
    price: 0,
    owner: "",
    stock: 0,
    description: "",
    tokenId: "",
    metadataUri: "",
    assetUri: "",
    tokenUri: "",
    createdAt: new Date()
};

interface NFTState {
    nft: NFT,
    setNft: (by: NFT) => void
}
// Create the store with persistence
const useNFTStore = create<NFTState>()(
    persist(
        (set) => ({
            nft: defaultNFT,
            setNft: (nft: NFT) => set({ nft }),
        }),
        {
            name: 'chillfund-nft-storage', // Storage key
        }
    )
);

export default useNFTStore;