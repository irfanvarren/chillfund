'use client';
import Navbar from "@/components/ui/Navbar";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Roboto } from "next/font/google";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomProvider, TLog } from "@/lib/types/tlog";
import createTransferTransaction from "@/lib/utils/createTransferTransaction";
import signAndSendTransaction from "@/lib/utils/signAndSendTransaction";
import pollSignatureStatus from "@/lib/utils/pollSignatureStatus";
import signTransaction from "@/lib/utils/signTransaction";
import signAllTransactions from "@/lib/utils/signAllTransactions";
import signMessage from "@/lib/utils/signMessage";
import { getProvider } from "@/lib/utils/getProvider";
import { debounce } from 'lodash';
import { Phantom } from '@phantom/wallet-sdk';

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

const NETWORK = "https://api.devnet.solana.com";
const connection = new Connection(NETWORK);
const message = 'To avoid digital dognappers, sign below to authenticate with CryptoCorgis.';

type SignatureResult = string | undefined;
export type ConnectedMethods = {
  name: string;
  onClick: () => Promise<SignatureResult | void>;
};

interface Props {
  publicKey: PublicKey | null;
  connectedMethods: ConnectedMethods[];
  isConnected: boolean;
  handleConnect: () => Promise<void>;
  logs: TLog[];
  clearLogs: () => void;
  phantomProvider: PhantomProvider | null;
  setWallet: (wallet: Phantom | null) => void;
}

const useProps = (): Props => {
  const [phantomProvider, setPhantomProvider] = useState<PhantomProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<TLog[]>([]);

  useEffect(() => {
    const provider = getProvider();
    console.log("provider", provider);
    if (provider) {
      setPhantomProvider(provider);
    }
  }, []);

  useEffect(() => {
    if (!phantomProvider || isConnecting || isConnected) return;

    const connectToWallet = debounce(async () => {
      if (!isConnecting && !isConnected) {
        try {
          setIsConnecting(true);
          await phantomProvider.connect();
          setIsConnected(true);
        } catch (error) {
          createLog({
            status: 'error',
            method: 'connect',
            message: (error as Error).message,
          });
          // Handle error
        } finally {
          setIsConnecting(false);
        }
      }
    }, 1000);

    const handleConnect = (publicKey: PublicKey) => {
      setIsConnected(true);
      createLog({
        status: 'success',
        method: 'connect',
        message: `Connected to account ${publicKey.toBase58()}`,
      });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      createLog({
        status: 'warning',
        method: 'disconnect',
        message: '👋',
      });
    };

    const handleAccountChanged = async (publicKey: PublicKey | null) => {
      if (publicKey) {
        setIsConnected(true);
        createLog({
          status: 'info',
          method: 'accountChanged',
          message: `Switched to account ${publicKey.toBase58()}`,
        });
      } else {
        setIsConnected(false);
        createLog({
          status: 'info',
          method: 'accountChanged',
          message: 'Attempting to switch accounts.',
        });

        if (!isConnecting) {
          try {
            setIsConnecting(true);
            await phantomProvider.connect();
            setIsConnected(true);
          } catch (error) {
            createLog({
              status: 'error',
              method: 'accountChanged',
              message: `Failed to re-connect: ${(error as Error).message}`,
            });
          } finally {
            setIsConnecting(false);
          }
        }
      }
    };

    phantomProvider.on('connect', handleConnect);
    phantomProvider.on('disconnect', handleDisconnect);
    phantomProvider.on('accountChanged', handleAccountChanged);

    connectToWallet();


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phantomProvider, isConnecting, isConnected]);

  const createLog = useCallback(
    (log: TLog) => {
      return setLogs((logs) => [...logs, log]);
    },
    [setLogs]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  const handleConnect = useCallback(async () => {
    if (!phantomProvider || isConnecting) return;

    try {
      setIsConnecting(true);
      await phantomProvider.connect();
      setIsConnected(true);
    } catch (error) {
      createLog({
        status: 'error',
        method: 'connect',
        message: (error as Error).message,
      });
    } finally {
      setIsConnecting(false);
    }
  }, [phantomProvider, isConnecting, createLog]);

  const handleDisconnect = useCallback(async () => {
    if (!phantomProvider || !isConnected) return;

    try {
      await phantomProvider.disconnect();
      setIsConnected(false);
    } catch (error) {
      createLog({
        status: 'error',
        method: 'disconnect',
        message: (error as Error).message,
      });
    }
  }, [phantomProvider, isConnected, createLog]);

  const handleSignAndSendTransaction = useCallback(async () => {
    if (!phantomProvider) return;

    try {
      const transaction = await createTransferTransaction(phantomProvider.publicKey!, connection);
      createLog({
        status: 'info',
        method: 'signAndSendTransaction',
        message: `Requesting signature for: ${JSON.stringify(transaction)}`,
      });
      const signature = await signAndSendTransaction(phantomProvider, transaction);
      createLog({
        status: 'info',
        method: 'signAndSendTransaction',
        message: `Signed and submitted transaction ${signature}.`,
      });
      pollSignatureStatus(signature, connection, createLog);
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signAndSendTransaction',
        message: (error as Error).message,
      });
    }
  }, [phantomProvider, createLog]);

  const handleSignTransaction = useCallback(async () => {
    if (!phantomProvider) return;

    try {
      const transaction = await createTransferTransaction(phantomProvider.publicKey!, connection);
      createLog({
        status: 'info',
        method: 'signTransaction',
        message: `Requesting signature for: ${JSON.stringify(transaction)}`,
      });
      const signedTransaction = await signTransaction(phantomProvider, transaction);
      createLog({
        status: 'success',
        method: 'signTransaction',
        message: `Transaction signed: ${JSON.stringify(signedTransaction)}`,
      });
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signTransaction',
        message: (error as Error).message,
      });
    }
  }, [phantomProvider, createLog]);

  const handleSignAllTransactions = useCallback(async () => {
    if (!phantomProvider) return;

    try {
      const transactions = [
        await createTransferTransaction(phantomProvider.publicKey!, connection),
        await createTransferTransaction(phantomProvider.publicKey!, connection),
      ];
      createLog({
        status: 'info',
        method: 'signAllTransactions',
        message: `Requesting signature for: ${JSON.stringify(transactions)}`,
      });
      const signedTransactions = await signAllTransactions(phantomProvider, transactions[0], transactions[1]);
      createLog({
        status: 'success',
        method: 'signAllTransactions',
        message: `Transactions signed: ${JSON.stringify(signedTransactions)}`,
      });
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signAllTransactions',
        message: (error as Error).message,
      });
    }
  }, [phantomProvider, createLog]);

  const handleSignMessage = useCallback(async () => {
    if (!phantomProvider) return;

    try {
      const signedMessage = await signMessage(phantomProvider, message);
      createLog({
        status: 'success',
        method: 'signMessage',
        message: `Message signed: ${JSON.stringify(signedMessage)}`,
      });
      return signedMessage;
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signMessage',
        message: (error as Error).message,
      });
    }
  }, [phantomProvider, createLog]);

  const connectedMethods = useMemo(() => {
    return [
      {
        name: 'Sign and Send Transaction',
        onClick: handleSignAndSendTransaction,
      },
      {
        name: 'Sign Transaction',
        onClick: handleSignTransaction,
      },
      {
        name: 'Sign All Transactions',
        onClick: handleSignAllTransactions,
      },
      {
        name: 'Sign Message',
        onClick: handleSignMessage,
      },
      {
        name: 'Disconnect',
        onClick: handleDisconnect,
      },
    ];
  }, [
    handleSignAndSendTransaction,
    handleSignTransaction,
    handleSignAllTransactions,
    handleSignMessage,
    handleDisconnect,
  ]);

  const setWallet = (wallet: Phantom | null) => {
    console.log("set wallet", wallet);


    if (!wallet) {
      // const walletPhantomProvider: PhantomProvider = {
      //   publicKey: null,
      //   isConnected: null,
      //   signAndSendTransaction: wallet.solana.signAndSendTransaction,
      //   signTransaction: wallet.solana.signTransaction,
      //   signAllTransactions: wallet.solana.signAllTransactions,
      //   signMessage: wallet.solana.signMessage,
      //   connect: wallet.solana.connect,
      //   disconnect: wallet.solana.disconnect,
      //   on: () => {
      //   },
      //   request: async () => { }
      // }
      setPhantomProvider(wallet.solana);
    }
  };

  return {
    publicKey: phantomProvider?.publicKey || null,
    connectedMethods,
    isConnected,
    handleConnect,
    logs,
    clearLogs,
    phantomProvider,
    setWallet
  };
};

const WalletPropsContext = createContext<Props | undefined>(undefined);

export function WalletPropsProvider({ children }: { children: React.ReactNode }) {
  const props = useProps();
  return (
    <WalletPropsContext.Provider value={props}>
      {children}
    </WalletPropsContext.Provider>
  );
}

export function useWalletProps() {
  const context = useContext(WalletPropsContext);
  if (context === undefined) {
    throw new Error('useWalletProps must be used within a WalletPropsProvider');
  }
  return context;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <AntdRegistry>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>
                <WalletPropsProvider>

                  <Navbar />
                  {children}
                </WalletPropsProvider>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
