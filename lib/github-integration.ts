import { Octokit } from '@octokit/rest';

function getOctokit() {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

export async function commitFile(
  path: string, 
  content: string, 
  message: string,
  agent: string
) {
  const octokit = getOctokit();
  try {
    // Get current file (if exists) to get SHA
    let sha: string | undefined;
    
    try {
      const { data: currentFile } = await octokit.repos.getContent({
        owner: 'sandrasocial',
        repo: 'selfie-ai-platform',
        path,
        ref: 'v4-rebuild'
      });
      
      if ('sha' in currentFile) {
        sha = currentFile.sha;
      }
    } catch (error) {
      // File doesn't exist yet, that's okay
      console.log(`Creating new file: ${path}`);
    }
    
    await octokit.repos.createOrUpdateFileContents({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform',
      path,
      message: `[${agent}]: ${message}`,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch: 'v4-rebuild'
    });
    
    return { success: true, message: 'File committed successfully' };
  } catch (error) {
    console.error('GitHub commit error:', error);
    return { success: false, error: error.message };
  }
}

export async function createBranch(branchName: string) {
  const octokit = getOctokit();
  try {
    const { data: ref } = await octokit.git.getRef({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform',
      ref: 'heads/v4-rebuild'
    });

    await octokit.git.createRef({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform',
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha
    });

    return { success: true, branch: branchName };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createPullRequest(
  title: string,
  description: string,
  sourceBranch: string,
  targetBranch: string = 'v4-rebuild'
) {
  const octokit = getOctokit();
  try {
    const { data: pr } = await octokit.pulls.create({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform',
      title,
      body: description,
      head: sourceBranch,
      base: targetBranch
    });
    
    return { success: true, pullRequest: pr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getFileContent(path: string) {
  const octokit = getOctokit();
  try {
    const { data } = await octokit.repos.getContent({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform',
      path,
      ref: 'v4-rebuild'
    });
    
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return { success: true, content, sha: data.sha };
    }
    
    return { success: false, error: 'Not a file' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function listFiles(path: string = '') {
  const octokit = getOctokit();
  try {
    const { data } = await octokit.repos.getContent({
      owner: 'sandrasocial',
      repo: 'selfie-ai-platform',
      path,
      ref: 'v4-rebuild'
    });
    
    if (Array.isArray(data)) {
      return { success: true, files: data };
    }
    
    return { success: false, error: 'Not a directory' };
  } catch (error) {
    return { success: false, error: error.message };
  }
} 