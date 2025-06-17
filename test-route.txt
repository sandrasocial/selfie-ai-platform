import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Payment system deployed successfully!',
    timestamp: new Date().toISOString(),
    apis: {
      stripe: '/api/webhooks/stripe',
      email: '/api/automation/email',
      monitoring: '/monitoring'
    }
  });
}
