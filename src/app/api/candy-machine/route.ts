import { NextRequest, NextResponse } from "next/server";
import { fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
export async function POST(request: NextRequest) {
    try {
        const umi = createUmi("https://api.devnet.solana.com");
        const body = await request.json();
        const { tokenUri } = body;
        console.log("tokenUri", tokenUri);
        const candyMachinePubkey = publicKey(tokenUri);
        //CR48e2GM7Se7CAZc3iQDQYRpFXvwt9UEqCkDbJhRsVuJ

        // Fetch the candy machine data
        const candyMachine = await fetchCandyMachine(umi, candyMachinePubkey);

        // Get the items and their configuration
        const items = candyMachine.items;
        const itemsAvailable = candyMachine.data.itemsAvailable.toString();
        console.log("candyMachine", candyMachine);
        return NextResponse.json(
            { success: true, nfts: items, itemsAvailable }
        );
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message });
    }
}