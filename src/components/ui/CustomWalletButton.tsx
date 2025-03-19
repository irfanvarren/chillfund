import { useWallet } from '@solana/wallet-adapter-react';
import { createPhantom, Phantom } from "@phantom/wallet-sdk";
import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useWalletProps } from '@/app/layout';
import { PublicKey } from '@solana/web3.js';
import { TokenBalanceDisplay } from '@/components/ui/TokenBalance';



const CustomWalletButton: React.FC = () => {
  const { publicKey, handleConnect: windowHandleConnect, isConnected: isWindowConnected } = useWalletProps();
  const { disconnect, connected, connecting } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [phantomWallet, setPhantomWallet] = useState<Phantom | null>(null);
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (publicKey) {
      setWalletPublicKey(publicKey);
    }
    const initPhantom = async () => {
      try {
        if (!isWindowConnected) {
          if (phantomWallet) {
            const walletConnect = await phantomWallet?.solana.connect();
            const publicKey = walletConnect.publicKey!.toBase58();
            setWalletPublicKey(publicKey);
          } else {
            const phantom = await createPhantom({
              element: "phantom-wallet-container",
              namespace: "chillfund",
            });
            setPhantomWallet(phantom);
          }
        }
      } catch (error) {
        console.error("Failed to initialize Phantom wallet:", error);
      }
    };

    initPhantom();

    return () => {
      if (phantomWallet) {
        phantomWallet.hide();
      }
    };
  }, [phantomWallet, publicKey]);

  const toggleDropdown = () => {

    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleConnect = () => {


    if (phantomWallet) {

      setLoadingConnect(false);
      setIsDropdownOpen(true);
      phantomWallet.show();
    } else {
      setLoadingConnect(true);
      windowHandleConnect();
    }
  };

  const handleDisconnect = async () => {
    if (phantomWallet) {
      setPhantomWallet(null);
      phantomWallet.hide();
      await phantomWallet.solana?.disconnect();
    }
    disconnect();
    setIsDropdownOpen(false);
  };

  const handleCopyAddress = useCallback(() => {

    if (walletPublicKey) {
      navigator.clipboard.writeText(walletPublicKey.toString());
      toast.success('Address copied!');
    }
  }, [walletPublicKey]);

  const handleViewExplorer = async () => {
    if (!phantomWallet) return;


    if (walletPublicKey) {
      window.open(
        `https://explorer.solana.com/address/${walletPublicKey.toString()}?cluster=devnet`,
        '_blank'
      );
    }
  };

  const walletAddress = useMemo(() => {
    if (!walletPublicKey) return '';
    if (phantomWallet) {

      const address = walletPublicKey.toString();
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    } else {
      const address = publicKey!.toString();
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }


  }, [phantomWallet, publicKey, walletPublicKey]);

  if (!phantomWallet && !connected) {
    return (
      <button
        onClick={handleConnect}
        className="cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500
          hover:from-purple-600 hover:to-blue-600
          text-white font-bold py-2 pl-4 pr-5 rounded-full
          shadow-lg transform transition-all duration-200
          hover:scale-105 active:scale-95"
        disabled={loadingConnect}
      >
        {(!loadingConnect || !connecting) ? (
          <div className='flex items-center space-x-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Connect Wallet</span>
          </div>
        ) : (
          <div>Connecting...</div>
        )
        }

      </button>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-gradient-to-r from-green-500 to-emerald-500
            hover:from-green-600 hover:to-emerald-600
            text-white font-bold py-2 px-6 rounded-full
            shadow-lg transform transition-all duration-200
            hover:scale-105 active:scale-95
            flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <span>{walletAddress}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl z-50">
            <div className="px-4 py-2 text-sm text-gray-500 border-b">
              Connected as
              <div className="font-mono text-xs mt-1 text-gray-700 text-ellipsis overflow-hidden">
                {walletPublicKey?.toString()}
              </div>
            </div>
            {/* Add the token balance display here */}
            <TokenBalanceDisplay />
            <button
              onClick={handleCopyAddress}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy address</span>
            </button>
            <button
              onClick={handleViewExplorer}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>View on Explorer</span>
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>

    </>
  );
};

export default CustomWalletButton;
