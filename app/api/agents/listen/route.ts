import { NextResponse } from 'next/server'

// PERMANENTLY DISABLED - Maya automation endpoint blocked for security
// This endpoint was used by Maya to trigger automated deployments
// and caused deployment loops. It is now permanently disabled.

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    message: 'Agent automation endpoint permanently disabled for security - Maya access revoked.',
    timestamp: new Date().toISOString(),
    status: 'DISABLED'
  }, { status: 403 });
}

export async function POST() {
  return NextResponse.json({ 
    success: false, 
    message: 'Agent automation endpoint permanently disabled for security - Maya access revoked.',
    timestamp: new Date().toISOString(),
    status: 'DISABLED'
  }, { status: 403 });
} 