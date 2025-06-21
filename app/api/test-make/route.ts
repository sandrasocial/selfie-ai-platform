import { testMakeConnection } from '@/lib/make-integration';

export async function GET() {
  const result = await testMakeConnection();
  return Response.json(result);
} 