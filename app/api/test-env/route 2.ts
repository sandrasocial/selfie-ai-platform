import { NextResponse } from 'next/server';

export async function GET() {
  // Only show agent-related env vars for security
  const agentEnvVars = Object.keys(process.env)
    .filter(key => key.includes('AGENT') || key.includes('GITHUB'))
    .reduce((obj, key) => {
      obj[key] = key.includes('TOKEN') ? '***' + process.env[key]?.slice(-4) : process.env[key];
      return obj;
    }, {} as Record<string, string>);

  return NextResponse.json({
    envVars: agentEnvVars,
    mayaTokenExists: !!process.env.AGENT_MAYA_TOKEN,
    mayaTokenLength: process.env.AGENT_MAYA_TOKEN?.length
  });
} 