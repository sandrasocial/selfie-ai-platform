import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent');
    const days = parseInt(searchParams.get('days') || '7');
    
    // Get audit log events
    const { data } = await octokit.rest.repos.listCommits({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform',
      since: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
      per_page: 100
    });
    
    // Filter by agent if specified
    const filteredData = agent 
      ? data.filter(commit => commit.commit.author?.name?.includes(agent))
      : data;
    
    // Format for agent consumption
    const auditEvents = filteredData.map(commit => ({
      timestamp: commit.commit.author?.date,
      agent: extractAgentFromCommit(commit),
      action: 'code_change',
      message: commit.commit.message,
      files: commit.files?.map(f => f.filename) || [],
      sha: commit.sha
    }));
    
    return NextResponse.json({
      events: auditEvents,
      summary: {
        total: auditEvents.length,
        byAgent: groupByAgent(auditEvents),
        timeRange: `${days} days`
      }
    });
    
  } catch (error) {
    console.error('Audit log error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit log' },
      { status: 500 }
    );
  }
}

function extractAgentFromCommit(commit: any): string {
  // Logic to identify which agent made the commit
  const message = commit.commit.message.toLowerCase();
  if (message.includes('maya') || message.includes('fix') || message.includes('implement')) return 'maya';
  if (message.includes('victoria') || message.includes('design') || message.includes('style')) return 'victoria';
  if (message.includes('rachel') || message.includes('copy') || message.includes('content')) return 'rachel';
  if (message.includes('quinn') || message.includes('test')) return 'quinn';
  if (message.includes('ava') || message.includes('automat')) return 'ava';
  return 'unknown';
}

function groupByAgent(events: any[]): Record<string, number> {
  return events.reduce((acc, event) => {
    acc[event.agent] = (acc[event.agent] || 0) + 1;
    return acc;
  }, {});
} 