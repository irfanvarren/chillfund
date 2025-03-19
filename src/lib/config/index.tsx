import { SolanaAdapter } from '@reown/appkit-adapter-solana'

import {
    AppKitNetwork,
    solana,
    solanaDevnet,
    solanaTestnet
} from '@reown/appkit/networks'
import {
    createAppKit,
    useAppKit,
    useAppKitAccount,
    useAppKitEvents,
    useAppKitNetwork,
    useAppKitState,
    useAppKitTheme,
    useDisconnect,
    useWalletInfo
} from '@reown/appkit/react'
import { useAppKitProvider } from '@reown/appkit/react'
import { type Provider } from '@reown/appkit-adapter-solana/react'

import {
    PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { PublicKey, Transaction } from '@solana/web3.js'


export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694' // this is a public projectId only to use on localhost

export const networks = [
    solanaDevnet,
    solana,
    solanaTestnet,
] as [AppKitNetwork, ...AppKitNetwork[]]


export const solanaAdapter = new SolanaAdapter({
    wallets: [
        new PhantomWalletAdapter(),
    ]
});

// Create modal
const modal = createAppKit({
    adapters: [solanaAdapter],
    networks,
    defaultNetwork: solanaDevnet,
    metadata: {
        name: 'AppKit Next.js Wagmi Solana',
        description: 'AppKit Next.js App Router with Wagmi Solana Adapters',
        url: 'https://reown.com/appkit',
        icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
    },
    projectId,
    themeMode: 'light',
    features: {
        email: false,
        socials: [],
        analytics: true
    },
    allowUnsupportedChain: false,
    enableWalletConnect: false,
    allWallets: 'HIDE',
    featuredWalletIds: ["a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393"]
})

export const createAppKitSigner = (walletProvider: Provider) => {
    if (!walletProvider.publicKey) {
        throw new Error("Wallet public key is undefined");
    }
    return {
        publicKey: new PublicKey(walletProvider.publicKey),
        signMessage: async (message: Uint8Array) => {
            return await walletProvider.signMessage(message);
        },
        signTransaction: async (transaction: Transaction) => {
            return await walletProvider.signTransaction(transaction);
        },
        signAllTransactions: async (transactions: Transaction[]) => {
            return await walletProvider.signAllTransactions(transactions);
        }
    };
}


export {
    modal,
    Provider,
    useAppKit,
    useAppKitState,
    useAppKitTheme,
    useAppKitEvents,
    useAppKitAccount,
    useAppKitProvider,
    useWalletInfo,
    useAppKitNetwork,
    useDisconnect
}
