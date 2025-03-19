// app/api/upload-asset/keypair-utils.ts
import fs from 'fs';
import { Keypair } from '@solana/web3.js';

/**
 * Create a Keypair from a secret key file at the specified path
 */
export function createKeypairFromFile(filePath: string): Keypair {
    const secretKeyString = fs.readFileSync(filePath, 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
}

/**
 * Create a UMI-compatible keypair from a secret key file
 */
export function createUmiKeypairFromFile(filePath: string) {
    const secretKeyString = fs.readFileSync(filePath, 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return { secretKey };
}