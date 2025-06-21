import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { logger } from '@/lib/utils/logger';

// In-memory rate limiting (per IP)
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;
const ipRequestMap = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const now = Date.now();
    let timestamps = ipRequestMap.get(ip) || [];
    // Remove timestamps older than window
    timestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
    if (timestamps.length >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    timestamps.push(now);
    ipRequestMap.set(ip, timestamps);
    // TODO: Use a persistent store (e.g., Redis) for production deployments

    const { email, source = 'homepage' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Check if email already exists in leads table
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();

    if (existingLead) {
      // Already signed up - still send success to avoid revealing this info
      return NextResponse.json({
        success: true,
        message: 'Check your email for your free guide!'
      });
    }

    // Add to leads table
    const { error: insertError } = await supabase
      .from('leads')
      .insert([
        {
          email,
          source,
          created_at: new Date().toISOString()
        }
      ]);

    if (insertError) {
      logger.error('Error inserting lead:', insertError);
      return NextResponse.json(
        { error: 'Failed to save your information. Please try again.' },
        { status: 500 }
      );
    }

    // TODO: Trigger email automation via Make.com webhook
    // This would be implemented when the webhook URL is available
    /*
    await fetch(process.env.MAKE_WEBHOOK_FREE_GUIDE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        source,
        timestamp: new Date().toISOString()
      })
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Check your email for your free guide!'
    });

  } catch (error) {
    logger.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
} 