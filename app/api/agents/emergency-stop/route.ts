import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// EMERGENCY STOP ENDPOINT - MAYA ACCESS PERMANENTLY BLOCKED
// This endpoint was used by Maya's automation and caused deployment issues
export async function POST() {
    console.log("EMERGENCY STOP ENDPOINT - ACCESS BLOCKED FOR MAYA");
    
    return NextResponse.json({
        success: false,
        message: 'Emergency stop endpoint disabled - Maya access permanently revoked for security.',
        timestamp: new Date().toISOString(),
        status: 'BLOCKED'
    }, { status: 403 });
}

export async function GET() {
    return NextResponse.json({
        success: false,
        message: 'Emergency stop endpoint disabled - Maya access permanently revoked for security.',
        timestamp: new Date().toISOString(),
        status: 'BLOCKED'
    }, { status: 403 });
}
