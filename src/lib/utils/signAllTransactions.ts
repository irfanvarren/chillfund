
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { PhantomProvider } from '../types/tlog';


/**
 * Signs an array of transactions
 * @param   {PhantomProvider} provider     a Phantom provider
 * @param   {Transaction}     transaction1 a transaction to sign
 * @param   {Transaction}     transaction2 a transaction to sign
 * @returns {Transaction[]}                an array of signed transactions
 */
const signAllTransactions = async (
    provider: PhantomProvider,
    transaction1: Transaction,
    transaction2: Transaction
): Promise<(Transaction | VersionedTransaction)[]> => {
    try {
        const transactions = await provider.signAllTransactions([transaction1, transaction2]);
        return transactions;
    } catch (error) {
        console.warn(error);
        throw new Error((error as Error).message);
    }
};

export default signAllTransactions;