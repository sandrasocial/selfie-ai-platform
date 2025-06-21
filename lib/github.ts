import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER || 'sandrasocial';
const repo = process.env.GITHUB_REPO || 'selfie-ai-platform';

export interface GitHubFile {
  path: string;
  content: string;
  message?: string;
}

export interface GitHubResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class GitHubService {
  // Test connection to GitHub
  static async testConnection(): Promise<GitHubResponse> {
    try {
      const { data: repoData } = await octokit.repos.get({
        owner,
        repo,
      });

      return {
        success: true,
        message: 'GitHub connection successful',
        data: {
          name: repoData.name,
          description: repoData.description,
          url: repoData.html_url,
          defaultBranch: repoData.default_branch,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'GitHub connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Create a new file
  static async createFile(file: GitHubFile): Promise<GitHubResponse> {
    try {
      const response = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file.path,
        message: file.message || `Create ${file.path}`,
        content: Buffer.from(file.content).toString('base64'),
      });

      return {
        success: true,
        message: 'File created successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create file',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Update an existing file
  static async updateFile(file: GitHubFile): Promise<GitHubResponse> {
    try {
      // First get the current file to get its SHA
      const { data: currentFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
      });

      if (Array.isArray(currentFile)) {
        throw new Error('Path is a directory, not a file');
      }

      const response = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file.path,
        message: file.message || `Update ${file.path}`,
        content: Buffer.from(file.content).toString('base64'),
        sha: currentFile.sha,
      });

      return {
        success: true,
        message: 'File updated successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update file',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Delete a file
  static async deleteFile(path: string, message?: string): Promise<GitHubResponse> {
    try {
      // Get the current file to get its SHA
      const { data: fileToDelete } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if (Array.isArray(fileToDelete)) {
        throw new Error('Path is a directory, not a file');
      }

      const response = await octokit.repos.deleteFile({
        owner,
        repo,
        path,
        message: message || `Delete ${path}`,
        sha: fileToDelete.sha,
      });

      return {
        success: true,
        message: 'File deleted successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete file',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // List files in a directory
  static async listFiles(path: string = ''): Promise<GitHubResponse> {
    try {
      const { data: files } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      return {
        success: true,
        message: 'Files listed successfully',
        data: Array.isArray(files) ? files.map(f => ({
          name: f.name,
          type: f.type,
          path: f.path,
          size: f.size,
          url: f.html_url,
        })) : [],
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to list files',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get file content
  static async getFileContent(path: string): Promise<GitHubResponse> {
    try {
      const { data: file } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if (Array.isArray(file)) {
        throw new Error('Path is a directory, not a file');
      }

      // Check if the file has content property (regular file)
      if (file.type !== 'file' || !('content' in file)) {
        throw new Error('File is not a regular file or does not have content');
      }

      const content = Buffer.from(file.content, 'base64').toString('utf-8');

      return {
        success: true,
        message: 'File content retrieved successfully',
        data: {
          content,
          path: file.path,
          size: file.size,
          url: file.html_url,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get file content',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Create or update file (handles both cases)
  static async createOrUpdateFile(file: GitHubFile): Promise<GitHubResponse> {
    try {
      // Try to get the file first to see if it exists
      try {
        const { data: existingFile } = await octokit.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        if (Array.isArray(existingFile)) {
          throw new Error('Path is a directory, not a file');
        }

        // File exists, update it
        return await this.updateFile(file);
      } catch (error: any) {
        if (error.status === 404) {
          // File doesn't exist, create it
          return await this.createFile(file);
        }
        throw error;
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create or update file',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
} 