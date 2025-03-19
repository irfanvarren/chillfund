'use client';

import { useState, useEffect } from 'react';
import { useWalletProps } from '@/app/layout';
import { Connection, PublicKey } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import { Recipient, transferTokensToMultipleRecipients, createMultipleTokenAccounts } from '@/lib/utils/transferTokens';
import { useRouter } from 'next/navigation';

export default function BatchTransfer() {
    const router = useRouter();
    const { publicKey, isConnected, phantomProvider } = useWalletProps();
    const [recipients, setRecipients] = useState<Recipient[]>([{ address: '', amount: 0 }]);
    const [isTransferring, setIsTransferring] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com');
    const mintAddress = process.env.NEXT_PUBLIC_USDT_MINT_ADDRESS!;

    // Fetch balance once when component mounts and wallet is connected
    useEffect(() => {
        async function fetchBalance() {
            if (!isConnected || !publicKey) return;

            try {
                setIsLoadingBalance(true);
                const mint = new PublicKey(mintAddress);

                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                    publicKey,
                    { mint }
                );

                if (tokenAccounts.value.length > 0) {
                    const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount;
                    setBalance(balance.uiAmount);
                } else {
                    setBalance(0);
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
                toast.error('Failed to fetch balance');
                setBalance(0);
            } finally {
                setIsLoadingBalance(false);
            }
        }

        fetchBalance();
    }, [isConnected, publicKey]);

    const addRecipient = () => {
        setRecipients([...recipients, { address: '', amount: 0 }]);
    };

    const removeRecipient = (index: number) => {
        setRecipients(recipients.filter((_, i) => i !== index));
    };

    const updateRecipient = (index: number, field: keyof Recipient, value: string | number) => {
        const newRecipients = [...recipients];
        newRecipients[index] = {
            ...newRecipients[index],
            [field]: value,
        };
        setRecipients(newRecipients);
    };

    const handleTransfer = async () => {
        if (!isConnected || !publicKey || !phantomProvider) {
            toast.error('Please connect your wallet');
            return;
        }

        const invalidRecipients = recipients.filter(
            r => !r.address || r.amount <= 0
        );

        if (invalidRecipients.length > 0) {
            toast.error('Please fill in all recipient details correctly');
            return;
        }

        const totalAmount = recipients.reduce((sum, recipient) => sum + recipient.amount, 0);
        if (totalAmount > balance) {
            toast.error('Insufficient balance');
            return;
        }

        try {
            setIsTransferring(true);

            // Create all needed token accounts in one transaction
            await createMultipleTokenAccounts(
                connection,
                phantomProvider,
                mintAddress,
                recipients.map(r => r.address)
            );

            // Perform all transfers in one transaction
            await transferTokensToMultipleRecipients(
                connection,
                phantomProvider,
                mintAddress,
                recipients
            );

            toast.success('Transfers completed successfully!');
            setRecipients([{ address: '', amount: 0 }]);

            // Refresh balance
            // ... balance refresh code ... 
            router.refresh();
        } catch (error) {
            console.error('Transfer error:', error);
            toast.error('Failed to complete transfers');
        } finally {
            setIsTransferring(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 pt-32">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Batch Token Transfer</h1>

                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    {isLoadingBalance ? (
                        <p>Loading balance...</p>
                    ) : (
                        <p className="text-lg">
                            Available Balance: <span className="font-bold">
                                {balance.toLocaleString()} USDT
                            </span>
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    {recipients.map((recipient, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    placeholder="Recipient Address"
                                    value={recipient.address}
                                    onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="w-32">
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={recipient.amount}
                                    onChange={(e) => updateRecipient(index, 'amount', Number(e.target.value))}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            {recipients.length > 1 && (
                                <button
                                    onClick={() => removeRecipient(index)}
                                    className="p-2 text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4 space-x-4">
                    <button
                        onClick={addRecipient}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Recipient
                    </button>

                    <button
                        onClick={handleTransfer}
                        disabled={isTransferring || !isConnected}
                        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600
              ${(isTransferring || !isConnected) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isTransferring ? 'Processing...' : 'Transfer Tokens'}
                    </button>
                </div>
            </div>
        </div>
    );
}