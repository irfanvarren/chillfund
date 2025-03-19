"use server";
import mintMoreTokens from '@/lib/utils/usdt/mintMoreTokens';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Parse the request body
    const body = await req.json();

    const { mintAddress, mintAuthority, recipientAddress, amount } = body;

    if (!mintAddress || !mintAuthority || !recipientAddress || !amount) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await mintMoreTokens(mintAddress, mintAuthority, recipientAddress, amount);
    return Response.json(result);
  } catch (error) {
    console.error('Error minting tokens:', error);
    return Response.json({ error: 'Failed to mint tokens' }, { status: 500 });
  }
}
