import { NextRequest, NextResponse } from 'next/server';
import { commitFile, createBranch, createPullRequest } from '@/lib/github-integration';

export async function POST(
  request: NextRequest,
  { params }: { params: { agent: string } }
) {
  try {
    const { agent } = params;
    const body = await request.json();
    const { action, path, content, message, title, description, branchName } = body;

    // Validate agent token
    const agentToken = process.env[`AGENT_${agent.toUpperCase()}_TOKEN`];
    const providedToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log('--- AGENT AUTH DEBUG ---');
    console.log('Agent:', agent);
    console.log('Header received:', request.headers.get('authorization'));
    console.log('Token from .env:', `***${agentToken?.slice(-4)}`);
    console.log('Token from header:', `***${providedToken?.slice(-4)}`);
    console.log('Env token length:', agentToken?.length);
    console.log('Header token length:', providedToken?.length);
    console.log('--- END DEBUG ---');

    if (!agentToken || providedToken !== agentToken) {
      console.log('Authentication failed. Tokens do not match.');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    switch (action) {
      case 'commit':
        // Accept both 'filePath' and 'path' for backward compatibility
        const commitPath = body.path || body.filePath;
        const commitResult = await commitFile(commitPath, content, message, agent);
        return NextResponse.json(commitResult);

      case 'create-branch':
        const branchResult = await createBranch(branchName);
        return NextResponse.json(branchResult);

      case 'create-pr':
        const prResult = await createPullRequest(title, description, branchName);
        return NextResponse.json(prResult);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agent: string } }
) {
  try {
    const { agent } = params;
    
    // Validate agent token
    const agentToken = process.env[`AGENT_${agent.toUpperCase()}_TOKEN`];
    const providedToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!agentToken || providedToken !== agentToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      agent,
      status: 'active',
      permissions: ['commit', 'create-branch', 'create-pr']
    });
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 