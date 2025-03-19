
import { keypairIdentity } from '@metaplex-foundation/umi';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createKeypairFromFile } from './keypair-utils';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
export async function initializeUmi() {
    try {
        const keypairPath = process.env.SOLANA_KEYPAIR_PATH;
        if (!keypairPath) {
            throw new Error('SOLANA_KEYPAIR_PATH environment variable is not set');
        }
        const solanaKeypair = createKeypairFromFile(keypairPath);
        const umiKeypair = fromWeb3JsKeypair(solanaKeypair);
        const umi = createUmi('https://api.devnet.solana.com')
            .use(mplCore())
            .use(mplCoreCandyMachine())
            .use(irysUploader())
            .use(mplTokenMetadata())
        umi.use(keypairIdentity(umiKeypair));
        console.log("Wallet public key:", umi.identity.publicKey.toString());
        return umi;
    } catch (error) {
        console.error("Failed to initialize UMI with keypair:", error);
        throw error;
    }
}