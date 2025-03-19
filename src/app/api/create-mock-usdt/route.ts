import { createMockUSDT } from '@/lib/utils/usdt/createMockUSDT';



export async function POST(
  req: Request
) {
  if (req.method !== 'POST') {
    return Response.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const result = await createMockUSDT();
    return Response.json(result);
  } catch (error) {
    console.error('Error creating mock USDT:', error);
    return Response.json({ error: 'Failed to create mock USDT' }, { status: 500 });
  }
}
