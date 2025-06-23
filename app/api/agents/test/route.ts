import { NextResponse } from 'next/server'

// MAYA TEST ENDPOINT - PERMANENTLY DISABLED FOR SECURITY
// This endpoint was used by Maya for automated testing and caused deployment loops
// It is now permanently disabled to prevent unauthorized access

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'Maya test endpoint permanently disabled - automation blocked for security',
    timestamp: new Date().toISOString(),
    status: 'DISABLED'
  }, { status: 403 });
}

export async function POST() {
  return NextResponse.json({
    success: false,
    message: 'Maya test endpoint permanently disabled - automation blocked for security',
    timestamp: new Date().toISOString(),
    status: 'DISABLED'
  }, { status: 403 });
}