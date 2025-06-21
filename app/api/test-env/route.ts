import { NextResponse } from 'next/server';

export async function GET() {
  const allEnvVars = { ...process.env };

  const relevantVars = Object.keys(allEnvVars)
    .filter(key => 
      key.includes('AGENT') || 
      key.includes('GITHUB') || 
      key.includes('SUPABASE')
    )
    .reduce((obj, key) => {
      // Obscure sensitive tokens/keys
      if (key.includes('TOKEN') || key.includes('KEY')) {
        obj[key] = `Set (length: ${allEnvVars[key]?.length || 0})`;
      } else {
        obj[key] = allEnvVars[key];
      }
      return obj;
    }, {} as Record<string, string>);

  return NextResponse.json({
    envVars: relevantVars,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `Set (length: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length})` : "MISSING",
  });
} 