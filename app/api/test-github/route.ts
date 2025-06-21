import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET() {
  try {
    // Check if token exists
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return NextResponse.json({ 
        error: 'No GitHub token found in environment',
        tip: 'Make sure GITHUB_TOKEN is in .env.local and server is restarted'
      }, { status: 500 });
    }
    
    // Log token info (safely)
    console.log('Token found, length:', token.length);
    console.log('Token starts with:', token.substring(0, 4));
    
    const octokit = new Octokit({ auth: token });
    
    // First, test authentication
    const { data: user } = await octokit.users.getAuthenticated();
    console.log('Authenticated as:', user.login);
    
    // Then try to read the repo
    const { data: repo } = await octokit.repos.get({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform'
    });
    console.log('Repo access confirmed:', repo.full_name);
    
    // Finally, create a test file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const testContent = `# Automation Test Success!\n\nThis file was created automatically at ${new Date().toISOString()}\n\nYour GitHub automation is working perfectly! 🎉`;
    
    const result = await octokit.repos.createOrUpdateFileContents({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform',
      path: `test-automation-${timestamp}.md`,
      message: '[Admin Dashboard]: GitHub automation test successful',
      content: Buffer.from(testContent).toString('base64'),
      branch: 'v4-rebuild'
    });
    
    return NextResponse.json({
      success: true,
      message: 'GitHub automation is working!',
      user: user.login,
      repo: repo.full_name,
      newFile: result.data.content?.html_url,
      nextSteps: 'Your agents can now commit code automatically!'
    });
    
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({
      error: error.message,
      status: error.status,
      hint: error.status === 401 ? 'Token may be invalid or lacks permissions' : 'Check console for details'
    }, { status: 500 });
  }
} 