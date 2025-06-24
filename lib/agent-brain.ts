import { createClient } from '@supabase/supabase-js'
import { Octokit } from '@octokit/rest'
import Anthropic from '@anthropic-ai/sdk'

// Define the Task type based on the actual database schema
export type Task = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  agent: string; // Database field name
  priority: 'low' | 'medium' | 'high';
  file_path?: string;
  status: string;
  completed_at?: string;
  workflow?: string[];
  current_agent_index?: number;
  agent_notes?: Record<string, any>;
  preview_url?: string;
  ready_for_review?: boolean;
};

// Initialize clients with lazy loading
let supabase: any = null;
let anthropic: any = null;
let octokit: any = null;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables are required');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

function getAnthropicClient() {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

function getOctokitClient() {
  if (!octokit) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    octokit = new Octokit({ auth: token });
  }
  return octokit;
}

const OWNER = "sandrasocial";
const REPO = "selfie-ai-platform";

// Agent personalities and capabilities
const agents: { [key: string]: any } = {
  "MAYA": {
    systemPrompt: `You are MAYA, a world-class software engineer. You specialize in creating clean, efficient, and well-documented React components using TypeScript and Tailwind CSS.
    - Your code must be production-ready.
    - You will be given a task to create a new component.
    - You must return only the complete, functional code for the component in a single block.
    - Do not include any explanations, apologies, or introductory text. Just the code.
    - Use 'use client' for interactive components.
    - Ensure all types are defined.
    - The file path will be determined by the system, just produce the code.`,
  },
  // Other agents can be defined here
};

// Updated function signature to match API endpoint usage
export async function processAgentTask(agentId: string, task: Task) {
  const agent = agents[agentId];
  if (!agent) {
    return { status: "failed", result: `Agent ${agentId} not found.` };
  }

  try {
    const analysis = await analyzeTask(agent, task);

    if (analysis.startsWith("Error:")) {
        return { status: "failed", result: analysis };
    }

    let result;
    switch (agentId) {
      case "MAYA":
        result = await handleMayaTask(task, analysis);
        break;
      default:
        result = `Agent ${agentId} has no defined actions.`;
        break;
    }

    return { status: "completed", result };
  } catch (error) {
    console.error(`Error processing task ${task.id}:`, error);
    if (error instanceof Error) {
        return { status: "failed", result: error.message };
    }
    return { status: "failed", result: "An unknown error occurred." };
  }
}

async function analyzeTask(agent: any, task: Task): Promise<string> {
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    if (!anthropicApiKey) {
        console.error("CRITICAL: ANTHROPIC_API_KEY is not set in environment variables.");
        return "Error: ANTHROPIC_API_KEY not configured.";
    }

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            system: agent.systemPrompt,
            messages: [{
                role: "user",
                content: `Here is the task: ${task.description}`
            }],
            max_tokens: 4000,
        });
        
        const contentBlock = response.content[0];
        if (contentBlock.type === 'text') {
            const content = contentBlock.text;
            return content.replace(/```(typescript|jsx)?|```/g, '').trim();
        }

        return "Error: Agent did not return text content.";

    } catch (error: any) {
        console.error("Error analyzing task:", error);
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "Error analyzing task with an unknown error.";
    }
}

function generateFilePath(title: string): string {
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `components/generated/${slug}.tsx`;
}

async function commitChangesToGitHub(filePath: string, content: string, commitMessage: string): Promise<string> {
    try {
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        if (!GITHUB_TOKEN) {
            console.error("CRITICAL: GITHUB_TOKEN is not set. Cannot commit changes.");
            throw new Error("GITHUB_TOKEN is not set. Cannot commit changes.");
        }
        const octokit = new Octokit({ auth: GITHUB_TOKEN });
        
        let sha;
        try {
            const { data: file } = await octokit.repos.getContent({
                owner: OWNER,
                repo: REPO,
                path: filePath
            });
            if (typeof file === 'object' && 'sha' in file && typeof file.sha === 'string') {
                sha = file.sha;
            }
        } catch (error: any) {
            if (error.status !== 404) throw error;
        }
        
        const { data: commitData } = await octokit.repos.createOrUpdateFileContents({
            owner: OWNER,
            repo: REPO,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(content).toString('base64'),
            sha
        });
        
        const url = commitData.commit.html_url;
        if (!url) {
            return "GitHub commit successful, but no URL was returned.";
        }
        console.log(`GitHub commit successful: ${url}`);
        return `GitHub commit successful: ${url}`;
    } catch (error) {
        console.error("GitHub commit failed:", error);
        if (error instanceof Error) {
            return `GitHub commit failed: ${error.message}`;
        }
        return "GitHub commit failed with an unknown error.";
    }
}

async function handleMayaTask(task: Task, analysis: string): Promise<string> {
    // Use the task title to generate a proper file path
    const componentName = task.title || "GeneratedComponent";
    const filePath = generateFilePath(componentName);
    const commitMessage = `feat(agent-maya): create ${componentName}`;
    
    return await commitChangesToGitHub(filePath, analysis, commitMessage);
} 