import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER || 'sandrasocial';
const repo = process.env.GITHUB_REPO || 'selfie-ai-platform';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType = 'connection' } = body;

    switch (testType) {
      case 'connection':
        // Test basic connection
        const { data: repoData } = await octokit.repos.get({
          owner,
          repo,
        });

        return NextResponse.json({
          success: true,
          message: 'GitHub connection test successful',
          repository: {
            name: repoData.name,
            description: repoData.description,
            url: repoData.html_url,
            defaultBranch: repoData.default_branch,
          },
        });

      case 'create_file':
        // Test file creation
        const testContent = `# GitHub Integration Test File

This file was created by the admin dashboard GitHub integration test.

Created at: ${new Date().toISOString()}
Test ID: ${Date.now()}

This file can be safely deleted after testing.`;

        const createResponse = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: `test/github-integration-test-${Date.now()}.md`,
          message: 'Test: GitHub integration file creation',
          content: Buffer.from(testContent).toString('base64'),
        });

        return NextResponse.json({
          success: true,
          message: 'GitHub file creation test successful',
          file: {
            path: createResponse.data.content?.path,
            url: createResponse.data.content?.html_url,
            sha: createResponse.data.content?.sha,
          },
        });

      case 'list_files':
        // Test listing files
        const { data: files } = await octokit.repos.getContent({
          owner,
          repo,
          path: '',
        });

        return NextResponse.json({
          success: true,
          message: 'GitHub file listing test successful',
          files: Array.isArray(files) ? files.map(f => ({
            name: f.name,
            type: f.type,
            path: f.path,
          })) : [],
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid test type. Supported types: connection, create_file, list_files',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GitHub test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'GitHub test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 