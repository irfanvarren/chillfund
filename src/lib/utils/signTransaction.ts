import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { PhantomProvider } from '../types/tlog';



/**
 * Signs a transaction
 * @param   {PhantomProvider} provider    a Phantom Provider
 * @param   {Transaction}     transaction a transaction to sign
 * @returns {Transaction}                 a signed transaction
 */
const signTransaction = async (provider: PhantomProvider, transaction: Transaction): Promise<(Transaction | VersionedTransaction)> => {
    try {
        const signedTransaction = await provider.signTransaction(transaction);
        return signedTransaction;
    } catch (error) {
        console.warn(error);
        throw new Error((error as Error).message,);
    }
};

export default signTransaction;