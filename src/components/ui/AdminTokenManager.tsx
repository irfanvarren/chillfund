"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type TokenInfo = {
  mintAddress: string;
  tokenAccount: string;
  mintAuthority: number[];
};

type MintFormData = {
  recipientAddress: string;
  amount: number;
};

export default function AdminTokenManager() {
  const router = useRouter();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MintFormData>();

  // Check for existing Mock USDT on component mount
  useEffect(() => {
    const existingMintAddress = process.env.NEXT_PUBLIC_USDT_MINT_ADDRESS;
    const existingTokenAccount = process.env.NEXT_PUBLIC_USDT_TOKEN_ACCOUNT;

    if (existingMintAddress && existingTokenAccount) {
      setTokenInfo({
        mintAddress: existingMintAddress,
        tokenAccount: existingTokenAccount,
        mintAuthority: [], // You might want to store this separately or handle differently
      });
    }
  }, []);

  const createToken = async () => {
    // Only proceed if token doesn't exist
    if (tokenInfo) {
      toast.error('Mock USDT already exists!');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/create-mock-usdt', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create token');
      }

      const data = await response.json();
      setTokenInfo(data);
      localStorage.setItem('mockUSDTInfo', JSON.stringify(data));
      toast.success('Mock USDT created successfully!');
      router.refresh();
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create Mock USDT');
    } finally {
      setIsLoading(false);
    }
  };

  const onMintSubmit = async (data: MintFormData) => {
    if (!tokenInfo) {
      toast.error('Mock USDT information not found');
      return;
    }

    try {
      setIsMinting(true);
      const response = await fetch('/api/mint-more-usdts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mintAddress: tokenInfo.mintAddress,
          mintAuthority: tokenInfo.mintAuthority,
          recipientAddress: data.recipientAddress,
          amount: data.amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mint tokens');
      }

      const result = await response.json();
      console.log(result);
      toast.success(`Successfully minted ${data.amount} tokens!`);
      reset();
    } catch (error) {
      console.error('Error minting tokens:', error);
      toast.error('Failed to mint tokens');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Mock USDT Admin Panel
        </h1>

        {/* Create Token Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Mock USDT Status
          </h2>

          {tokenInfo ? (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-700 mb-2">Existing Token Details:</h3>
              <div className="space-y-2 text-sm">
                <p className="break-all">
                  <span className="font-medium">Mint Address:</span>{' '}
                  {tokenInfo.mintAddress}
                </p>
                <p className="break-all">
                  <span className="font-medium">Token Account:</span>{' '}
                  {tokenInfo.tokenAccount}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={createToken}
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating...' : 'Create New Token'}
            </button>
          )}
        </div>

        {/* Mint Tokens Section */}
        {tokenInfo && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Mint More Tokens
            </h2>
            <form onSubmit={handleSubmit(onMintSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Address
                </label>
                <input
                  {...register('recipientAddress', { required: 'Address is required' })}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter recipient wallet address"
                />
                {errors.recipientAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.recipientAddress.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  {...register('amount', {
                    required: 'Amount is required',
                    min: { value: 1, message: 'Amount must be at least 1' },
                  })}
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount to mint"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isMinting}
                className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors
                  ${isMinting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isMinting ? 'Minting...' : 'Mint Tokens'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}