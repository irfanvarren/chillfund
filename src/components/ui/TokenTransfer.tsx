import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TokenTransfer(sourceTokenAccount: PublicKey) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your token mint address
  const MOCK_USDT_MINT = new PublicKey('C5kunymPXL61vQNUPM7VFQLv4pXiLJ38bNqDvEBzfRgD');

  const transferTokens = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first!');
      return;
    }

    try {
      setIsLoading(true);

      // Get the recipient's ATA (Associated Token Account)
      const recipientATA = await getAssociatedTokenAddress(
        MOCK_USDT_MINT,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Create a new transaction
      const transaction = new Transaction();

      // Check if the recipient's ATA exists
      const recipientAccount = await connection.getAccountInfo(recipientATA);

      // If recipient's ATA doesn't exist, create it
      if (!recipientAccount) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            recipientATA, // token account address
            publicKey, // owner
            MOCK_USDT_MINT, // mint
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      // Add transfer instruction
      const transferAmount = parseFloat(amount) * 1_000_000; // Assuming 6 decimals

      transaction.add(
        createTransferInstruction(
          sourceTokenAccount, // from token account
          recipientATA, // to token account
          publicKey, // owner
          transferAmount, // amount
          [], // multi signers
          TOKEN_PROGRAM_ID
        )
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      toast.success('Tokens transferred successfully!');
      setAmount('');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to transfer tokens');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Transfer Tokens to Wallet</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Transfer
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter amount"
              min="0"
              step="0.000001"
            />
          </div>

          <button
            onClick={transferTokens}
            disabled={isLoading || !publicKey}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md
              ${isLoading || !publicKey ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
            `}
          >
            {isLoading ? 'Transferring...' : 'Transfer Tokens'}
          </button>

          {!publicKey && (
            <p className="text-sm text-red-600">
              Please connect your wallet to transfer tokens
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
