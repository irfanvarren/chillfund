import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
} from '@solana/spl-token';
import {

    Connection,
} from '@solana/web3.js';
import { createKeypairFromFile } from '@/lib/utils/keypair-utils';

// Initialize connection to devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export async function createMockUSDT() {
    try {
        const keypairPath = process.env.SOLANA_KEYPAIR_PATH;
        if (!keypairPath) {
            throw new Error('SOLANA_KEYPAIR_PATH environment variable is not set');
        }
        const mintAuthority = createKeypairFromFile(keypairPath);
        // Create a new keypair for the mint authority
        // const mintAuthority = Keypair.generate();

        // Request some SOL from devnet faucet
        // const airdropSignature = await connection.requestAirdrop(
        //     mintAuthority.publicKey,
        //     2 * LAMPORTS_PER_SOL
        // );
        // await connection.confirmTransaction(airdropSignature);

        console.log('Mint Authority:', mintAuthority.publicKey.toString());

        // Create new token mint
        const mint = await createMint(
            connection,
            mintAuthority,
            mintAuthority.publicKey, // mint authority
            mintAuthority.publicKey, // freeze authority
            6 // decimals (USDT uses 6 decimals)
        );

        console.log('Token Mint Created:', mint.toString());

        // Create associated token account for mint authority
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            mintAuthority,
            mint,
            mintAuthority.publicKey
        );

        console.log('Token Account:', tokenAccount.address.toString());

        // Mint some tokens (let's mint 1000 mock USDT)
        const mintAmount = 1000_000000; // 1000 tokens with 6 decimals
        await mintTo(
            connection,
            mintAuthority,
            mint,
            tokenAccount.address,
            mintAuthority,
            mintAmount
        );

        // Return the important information
        return {
            mintAddress: mint.toString(),
            tokenAccount: tokenAccount.address.toString(),
            mintAuthority: Array.from(mintAuthority.secretKey),
        };
    } catch (error) {
        console.error('Error creating mock USDT:', error);
        throw error;
    }
}
