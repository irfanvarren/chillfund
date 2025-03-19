'use client';

import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { useState, useEffect, useCallback } from 'react';
import { PhantomProvider } from '../types/tlog';

export async function getTokenBalance(
  connection: Connection,
  walletAddress: string,
  mintAddress: string
): Promise<number> {
  try {
    const wallet = new PublicKey(walletAddress);
    const mint = new PublicKey(mintAddress);

    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      wallet,
      { mint: mint }
    );

    // If no token accounts found, return 0
    if (tokenAccounts.value.length === 0) {
      return 0;
    }

    // Get the balance from the first token account
    const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount;
    return balance.uiAmount;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
}

export const useTokenAccount = (
  connection: Connection,
  walletAddress: string | null,
  mintAddress: string
) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!walletAddress) {
      setBalance(0);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const tokenBalance = await getTokenBalance(
        connection,
        walletAddress,
        mintAddress
      );
      setBalance(tokenBalance);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError((err as Error).message);
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  }, [connection, walletAddress, mintAddress]);

  useEffect(() => {
    fetchBalance();
  }, []);

  return { balance, isLoading, error, refetch: fetchBalance };
};

export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  provider: PhantomProvider,
  mintAddress: string,
  ownerAddress?: string
): Promise<string> {
  try {
    if (!provider.publicKey) throw new Error('Wallet not connected');

    const mint = new PublicKey(mintAddress);
    const owner = ownerAddress ? new PublicKey(ownerAddress) : provider.publicKey;

    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      owner
    );

    // Check if the token account already exists
    const accountInfo = await connection.getAccountInfo(tokenAccount);

    if (!accountInfo) {
      console.log('Creating new token account...');
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          provider.publicKey, // payer
          tokenAccount, // associatedToken
          owner, // owner
          mint // mint
        )
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = provider.publicKey;

      const signed = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);
      console.log('Token account created:', tokenAccount.toString());
    } else {
      console.log('Token account already exists:', tokenAccount.toString());
    }

    return tokenAccount.toString();
  } catch (error) {
    console.error('Error in getOrCreateAssociatedTokenAccount:', error);
    throw error;
  }
}

export async function createMultipleTokenAccounts(
  connection: Connection,
  provider: PhantomProvider,
  mintAddress: string,
  recipientAddresses: string[]
) {
  if (!provider.publicKey) throw new Error('Wallet not connected');

  const mintPubkey = new PublicKey(mintAddress);
  const instructions = [];

  // Collect all create account instructions
  for (const recipientAddress of recipientAddresses) {
    const owner = new PublicKey(recipientAddress);
    const tokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      owner
    );

    // Only add instruction if account doesn't exist
    const accountInfo = await connection.getAccountInfo(tokenAccount);
    if (!accountInfo) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          provider.publicKey, // payer
          tokenAccount,
          owner,
          mintPubkey
        )
      );
    }
  }

  // If any accounts need to be created, send as one transaction
  if (instructions.length > 0) {
    const transaction = new Transaction();
    transaction.add(...instructions);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);
  }
}

export async function transferTokensToMultipleRecipients(
  connection: Connection,
  provider: PhantomProvider,
  mintAddress: string,
  recipients: Recipient[]
) {
  if (!provider.publicKey) {
    throw new Error('Wallet not connected');
  }

  try {
    // Get or create sender's token account
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      provider,
      mintAddress
    );

    // Create transfer instructions
    const instructions = await Promise.all(
      recipients.map(async (recipient) => {
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          provider,
          mintAddress,
          recipient.address
        );

        return createTransferInstruction(
          new PublicKey(fromTokenAccount),
          new PublicKey(toTokenAccount),
          provider.publicKey!,
          BigInt(recipient.amount * (10 ** 6)) // Assuming 6 decimals for USDT
        );
      })
    );

    // Create and send transaction
    const transaction = new Transaction();
    transaction.add(...instructions);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);

    return signature;
  } catch (error) {
    console.error('Error in transferTokensToMultipleRecipients:', error);
    throw error;
  }
}

export interface Recipient {
  address: string;
  amount: number;
}