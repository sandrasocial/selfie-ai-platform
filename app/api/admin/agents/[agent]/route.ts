import { NextRequest, NextResponse } from 'next/server';
import { commitFile, createBranch, createPullRequest } from '@/lib/github-integration';

export async function POST(
  request: NextRequest,
  { params }: { params: { agent: string } }
) {
  try {
    const { agent } = params;
    const body = await request.json();
    const { action, path, content, message, title, description, branchName, filePath, task } = body;

    // Validate agent token
    const agentToken = process.env[`AGENT_${agent.toUpperCase()}_TOKEN`];
    const providedToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!agentToken || !providedToken || agentToken !== providedToken) {
      console.log('--- AGENT AUTH DEBUG ---');
      console.log('Agent:', agent);
      console.log('Header received:', request.headers.get('authorization') ? 'Bearer [REDACTED]' : 'None');
      console.log('Token from .env:', agentToken ? '[REDACTED]' : 'None');
      console.log('Token from header:', providedToken ? '[REDACTED]' : 'None');
      console.log('Env token length:', agentToken?.length || 0);
      console.log('Header token length:', providedToken?.length || 0);
      console.log('--- END DEBUG ---');
      console.log('Authentication failed. Tokens do not match.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Authentication successful');

    switch (action) {
      case 'commit':
        const commitPath = path || filePath;
        if (!commitPath) {
          return NextResponse.json({ error: 'File path is required' }, { status: 400 });
        }
        
        // Extract title from task object or use provided title
        const commitTitle = task?.title || title || 'Agent commit';
        const commitMessage = `[${agent}]: ${commitTitle}`;
        
        console.log('--- COMMIT DEBUG ---');
        console.log('Path:', commitPath);
        console.log('Task:', task);
        console.log('Title:', commitTitle);
        console.log('Message:', commitMessage);
        console.log('--- END DEBUG ---');
        
        try {
          const result = await commitFile(commitPath, content, commitMessage, agent);
          return NextResponse.json({ success: true, result });
        } catch (error: any) {
          console.error('GitHub commit error:', error);
          return NextResponse.json({ 
            success: false, 
            error: error.message || 'Commit failed',
            details: error.response?.data || error
          }, { status: 500 });
        }

      case 'branch':
        if (!branchName) {
          return NextResponse.json({ error: 'Branch name is required' }, { status: 400 });
        }
        
        try {
          const result = await createBranch(branchName);
          return NextResponse.json({ success: true, result });
        } catch (error: any) {
          console.error('Branch creation error:', error);
          return NextResponse.json({ 
            success: false, 
            error: error.message || 'Branch creation failed' 
          }, { status: 500 });
        }

      case 'pr':
        if (!title || !description || !branchName) {
          return NextResponse.json({ error: 'Title, description, and branch name are required' }, { status: 400 });
        }
        
        try {
          const result = await createPullRequest(title, description, branchName);
          return NextResponse.json({ success: true, result });
        } catch (error: any) {
          console.error('PR creation error:', error);
          return NextResponse.json({ 
            success: false, 
            error: error.message || 'PR creation failed' 
          }, { status: 500 });
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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