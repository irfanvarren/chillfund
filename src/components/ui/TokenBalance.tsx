'use client';

import { useState, useEffect } from 'react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWalletProps } from '@/app/layout';

interface TokenBalance {
    mint: string;
    amount: number;
    decimals: number;
    uiAmount: number;
}

export const TokenBalanceDisplay = () => {
    const { publicKey, isConnected } = useWalletProps();
    const [balance, setBalance] = useState<TokenBalance | null>(null);
    const [loading, setLoading] = useState(false);

    const CUSTOM_USDT_MINT = new PublicKey('Bn29KuF4Qs5bLs2Y4654mfgM9sWB3WNnCtUwjm3pYiWM');
    const connection = new Connection('https://api.devnet.solana.com');

    const getTokenBalance = async () => {
        if (!publicKey) return;

        try {
            setLoading(true);
            console.log("connection", connection);
            // Get all token accounts for the connected wallet
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                publicKey,
                {
                    programId: TOKEN_PROGRAM_ID,
                }
            );
            if (tokenAccounts) {
                // Find the custom USDT token account
                const usdtAccount = tokenAccounts.value.find(
                    account => account.account.data.parsed.info.mint === CUSTOM_USDT_MINT.toString()
                );

                if (usdtAccount) {
                    const parsedInfo = usdtAccount.account.data.parsed.info;
                    setBalance({
                        mint: parsedInfo.mint,
                        amount: parsedInfo.tokenAmount.amount,
                        decimals: parsedInfo.tokenAmount.decimals,
                        uiAmount: parsedInfo.tokenAmount.uiAmount,
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching token balance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("isConnected", isConnected);
        console.log("publicKey", publicKey);
        if (isConnected && publicKey) {
            getTokenBalance();
        } else {
            setBalance(null);
        }
    }, [isConnected, publicKey]);

    if (!isConnected) return null;

    return (
        <div className="px-4 py-2 text-sm text-gray-700">
            <div className="font-semibold">USDT Balance</div>
            {loading ? (
                <div className="text-gray-500">Loading balance...</div>
            ) : balance ? (
                <div className="font-mono">
                    {balance.uiAmount.toLocaleString()} USDT
                </div>
            ) : (
                <div className="text-gray-500">No balance found</div>
            )}
        </div>
    );
};
