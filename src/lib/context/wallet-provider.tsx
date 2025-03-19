'use client'

import React, { type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { networks, projectId, solanaAdapter } from '../config'
import { createAppKit } from '@reown/appkit/react'
import {
    solanaDevnet
} from '@reown/appkit/networks'
// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
export const appKitMetadata = {
    name: 'AppKit Next.js Wagmi',
    description: 'AppKit Next.js App Router Wagmi Example',
    url: 'https://appkit-lab.reown.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const modal = createAppKit({
    adapters: [solanaAdapter],
    projectId,
    networks,
    defaultNetwork: solanaDevnet,
    metadata: appKitMetadata,
    themeMode: 'light',
    features: {
        email: false,
        socials: [],
        analytics: true // Optional - defaults to your Cloud configuration
    },
    allowUnsupportedChain: false,
    enableWalletConnect: false,
    allWallets: 'HIDE',
    featuredWalletIds: ["a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393"]
})

function ContextProvider({ children }: { children: ReactNode; }) {

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>

    )
}

export default ContextProvider
