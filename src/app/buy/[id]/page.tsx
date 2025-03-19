"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi"; // Import back icon
import useNFTStore from "@/lib/context/nftStore";
import { useWalletProps } from "@/app/layout";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { mintV1, fetchCandyMachine, mplCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";

export default function BuyNFTPage() {
    const { phantomProvider } = useWalletProps();
    const { id } = useParams();
    const nftId = decodeURIComponent(id!.toString());
    const router = useRouter(); // Get router instance
    const [qty, setQty] = useState(1);
    const nft = useNFTStore((state) => state.nft);
    const [availableStock, setAvailableStock] = useState(0);
    console.log("ph provider", phantomProvider);
    console.log(nft);
    const decreaseQty = () => {
        if (qty > 1) setQty(qty - 1);
    };

    const increaseQty = () => {
        setQty(qty + 1);
    };



    const mint = async () => {
        const phantomWalletAdapter = new PhantomWalletAdapter();

        // Connect the wallet adapter first
        if (!phantomWalletAdapter.connected) {
            try {
                await phantomWalletAdapter.connect();
            } catch (error) {
                console.error('Failed to connect to Phantom wallet:', error);
                return;
            }
        }
        console.log("pa", phantomWalletAdapter);
        const umi = createUmi("https://api.devnet.solana.com");
        umi.use(mplCandyMachine());
        umi.use(walletAdapterIdentity(phantomWalletAdapter));

        const candyMachinePublicKey = publicKey(nft.tokenUri);
        const candyMachine = await fetchCandyMachine(
            umi,
            candyMachinePublicKey
        );
        console.log("cm", candyMachine);
        const coreCollection = publicKey(candyMachine.collectionMint);
        const nftMint = generateSigner(umi);
        const mintResult = await mintV1(umi, {
            candyMachine: candyMachinePublicKey,
            asset: nftMint,
            collection: coreCollection,
        }).sendAndConfirm(umi);
        console.log("mintResult", mintResult);
    }
    useEffect(() => {

        const fetchCandyMachine = async () => {
            const res = await fetch('/api/candy-machine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tokenUri: nft.tokenUri })
            });
            const candyMachine = await res.json();
            console.log("candy machine :", candyMachine);
            setAvailableStock(candyMachine.itemsAvailable ?? 0);
        };
        fetchCandyMachine();
    });

    return (
        <div className="min-h-screen bg-[#c2dbfa] px-24 py-28 pt-32 flex justify-center items-center">
            {/* Back Button */}
            <button
                onClick={() => router.push("/marketplace")}
                className="absolute top-[90px] left-5 flex items-center gap-2 text-[#0070d3] font-semibold hover:underline"
            >
                <BiArrowBack className="text-2xl" /> Back to Marketplace
            </button>

            {/* Card Container */}
            <div className="bg-white shadow-2xl rounded-4xl p-10 w-full max-w-5xl">
                {/* Title */}
                <h1 className="text-5xl font-extrabold font-roboto text-gray-800 mb-9 text-left">
                    Purchase
                </h1>

                {/* Flex Container (50:50 Split) */}
                <div className="flex flex-col md:flex-row w-full">
                    {/* Left - NFT Image (50%) */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden shadow-lg bg-[#f2f2f2]">
                            {/* Top Center Overlay Text */}
                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-[#b1b5b8] px-3 py-1 text-lg tracking-wider font-bold rounded-md z-50">
                                {nftId}
                            </div>
                            <Image
                                src="/images/nft.png"
                                alt={`${nftId}`}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right - NFT Details (50%) */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-gray-800 text-center px-6">
                        <div className="bg-[#ece9f7] px-6 py-6 rounded-4xl w-full">
                            <p className="text-4xl mb-4 font-bold text-[#f13a97]">
                                {availableStock} / {nft!.stock}
                            </p>
                            <div className="text-4xl font-bold">
                                <p> {nft!.price} USDT / NFT</p>
                            </div>
                            <div className="text-sm mb-5 text-gray-500">(EXCLUDING GAS)</div>

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-center space-x-5">
                                <button
                                    onClick={decreaseQty}
                                    className="cursor-pointer bg-[#0070d3] w-[45px] h-[45px] flex items-center justify-center rounded-full text-black font-extrabold text-3xl border-2 border-black"
                                >
                                    <AiOutlineMinus />
                                </button>
                                <input
                                    type="text"
                                    className="bg-white rounded-xl w-[80px] border-black border-2 text-lg font-semibold text-center h-[45px] shadow-[0_4px_0_#808080]"
                                    value={qty}
                                    readOnly
                                />
                                <button
                                    onClick={increaseQty}
                                    className="cursor-pointer bg-[#f13a97] w-[45px] h-[45px] flex items-center justify-center rounded-full text-black font-extrabold text-3xl border-2 border-black"
                                >
                                    <AiOutlinePlus />
                                </button>
                            </div>

                            {/* Buy Button */}
                            <div className="mt-6 w-full flex justify-center">
                                <button onClick={() => mint()} className="cursor-pointer bg-[#ffde58] w-[100px] h-[40px] text-[#0070d3] rounded-xl font-bold shadow-[4px_-4px_0px_#5b7297] transition hover:bg-[#ffd433] flex items-center justify-center">
                                    Buy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms & Conditions */}
                <div className="mt-5 text-sm text-gray-600">
                    <strong>COLLECTION TERMS AND CONDITIONS:</strong>
                    <ol className="list-decimal list-inside mt-2">
                        <li>
                            THE RETURN OF THIS NFT IS <span className="text-red-500">FIXED RATE 1%</span>/MONTH, STARTING 6 MONTHS AFTER PURCHASE
                        </li>
                        <li>NFT IS USED AS PROOF OF OWNERSHIP AND CANNOT BE SOLD</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
