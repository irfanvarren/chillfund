"use client";

import { getAllNFTs } from "@/db/queries";
import { NFT } from "@/db/schema";
import useNFTStore from "@/lib/context/nftStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Marketplace() {
    const [nfts, setNfts] = useState<NFT[]>([]);
    const router = useRouter();
    const setNft = useNFTStore((state) => state.setNft);
    useEffect(() => {
        const getNFTs = async () => {
            try {

                const fetchedNFTs = await getAllNFTs();
                setNfts(fetchedNFTs);
                console.log(fetchedNFTs);
            } catch (error) {
                console.log(error);
            }
        }
        getNFTs();
    }, []);
    const handleClick = (nft: NFT, nftUri: string) => {
        setNft(nft);
        router.push(`/buy/${nftUri}`);
    }
    return (
        <div className="min-h-screen bg-[#f5f7fa] px-24 py-28">
            {/* Marketplace Title */}
            <h1 className="text-5xl font-extrabold font-roboto text-gray-800 mb-9">Marketplace</h1>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {nfts.map((nft, index) => (
                    <button key={index} onClick={() => handleClick(nft, `${nft.name} ${index + 1}`)} className="relative aspect-square rounded-3xl overflow-hidden shadow-lg block ">
                        {/* NFT Image */}
                        <Image
                            src="/images/nft.png"
                            alt={`NFT ${index + 1}`}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-lg mt-5"
                        />

                        {/* Top Center Overlay Text */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2  text-[#b1b5b8] px-3 py-1 text-lg tracking-wider font-bold rounded-md">
                            {nft.name}{index + 1}
                        </div>

                        {/* Bottom Overlay Text */}
                        <div className="absolute bottom-0 left-0 w-full bg-[#2a2a2a] bg-opacity-50 text-white p-2 text-sm font-semibold">
                            <div className="text-lg mb-2">NFT AVL: {nft.stock} NFT</div>
                            <div className="text-sm font-extralight">
                                <div>VALUE OF INVESTMENT / NFT</div>
                                <div className="px-3">
                                    <div className="float-left">{nft.price} USDT</div>
                                    <div className="text-[#7bde45] float-right font-extrabold">FLOATING RATE</div>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
