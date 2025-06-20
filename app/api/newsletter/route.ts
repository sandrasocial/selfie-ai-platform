import { NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    // TODO: Integrate with database or email service
    logger.info('Newsletter signup', email);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 