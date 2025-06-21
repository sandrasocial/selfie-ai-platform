import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER || 'sandrasocial';
const repo = process.env.GITHUB_REPO || 'selfie-ai-platform';

export async function GET() {
  try {
    // Test the connection by getting repository info
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });

    return NextResponse.json({
      success: true,
      message: 'GitHub connection successful',
      repository: {
        name: repoData.name,
        description: repoData.description,
        url: repoData.html_url,
        defaultBranch: repoData.default_branch,
      },
    });
  } catch (error) {
    console.error('GitHub connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to GitHub',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, path, content, message } = body;

    switch (action) {
      case 'create_file':
        const createResponse = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message: message || `Create ${path}`,
          content: Buffer.from(content).toString('base64'),
        });

        return NextResponse.json({
          success: true,
          message: 'File created successfully',
          data: createResponse.data,
        });

      case 'update_file':
        // First get the current file to get its SHA
        const { data: currentFile } = await octokit.repos.getContent({
          owner,
          repo,
          path,
        });

        if (Array.isArray(currentFile)) {
          throw new Error('Path is a directory, not a file');
        }

        const updateResponse = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message: message || `Update ${path}`,
          content: Buffer.from(content).toString('base64'),
          sha: currentFile.sha,
        });

        return NextResponse.json({
          success: true,
          message: 'File updated successfully',
          data: updateResponse.data,
        });

      case 'delete_file':
        // Get the current file to get its SHA
        const { data: fileToDelete } = await octokit.repos.getContent({
          owner,
          repo,
          path,
        });

        if (Array.isArray(fileToDelete)) {
          throw new Error('Path is a directory, not a file');
        }

        const deleteResponse = await octokit.repos.deleteFile({
          owner,
          repo,
          path,
          message: message || `Delete ${path}`,
          sha: fileToDelete.sha,
        });

        return NextResponse.json({
          success: true,
          message: 'File deleted successfully',
          data: deleteResponse.data,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action. Supported actions: create_file, update_file, delete_file',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'GitHub operation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 