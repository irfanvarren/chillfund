"use server";
import {
  mintTo,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import {
  Connection,
  PublicKey,
} from '@solana/web3.js';
import { createKeypairFromFile } from '../keypair-utils';

export default async function mintMoreTokens(
  mintAddress: string,
  mintAuthoritySecretKey: number[],
  recipientAddress: string,
  amount: number
) {
  const keypairPath = process.env.SOLANA_KEYPAIR_PATH;
  if (!keypairPath) {
    throw new Error('SOLANA_KEYPAIR_PATH environment variable is not set');
  }
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Convert mint authority secret key back to Uint8Array
  const mintAuthority = createKeypairFromFile(keypairPath);


  const mint = new PublicKey(mintAddress);

  // Get or create token account for recipient
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintAuthority,
    mint,
    new PublicKey(recipientAddress)
  );

  // Mint tokens (amount should be multiplied by 10^6 for 6 decimals)
  const mintAmount = amount * 1_000000;
  await mintTo(
    connection,
    mintAuthority,
    mint,
    recipientTokenAccount.address,
    mintAuthority,
    mintAmount
  );

  return {
    success: true,
    recipientTokenAccount: recipientTokenAccount.address.toString(),
    amount
  };
}
