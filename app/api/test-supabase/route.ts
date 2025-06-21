import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrlExists = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKeyExists = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKeyExists = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  let serviceKeyLength = 0;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    serviceKeyLength = process.env.SUPABASE_SERVICE_ROLE_KEY.length;
  }

  const allKeysPresent = supabaseUrlExists && supabaseAnonKeyExists && supabaseServiceKeyExists;

  return NextResponse.json({
    message: "Environment variable check for production debugging.",
    allKeysPresent,
    details: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrlExists ? "FOUND" : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKeyExists ? "FOUND" : "MISSING",
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKeyExists ? "FOUND" : "MISSING",
      SUPABASE_SERVICE_ROLE_KEY_length: serviceKeyLength
    }
  });
} 