import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Dev task types
const DevTaskSchema = z.object({
  type: z.enum(['feature', 'bugfix', 'refactor', 'optimization', 'review']),
  description: z.string(),
  files: z.array(z.string()).optional(),
  urgency: z.enum(['low', 'medium', 'high']).default('medium')
});

interface DevAIResponse {
  success: boolean;
  result?: {
    analysis: string;
    suggestedChanges: Array<{
      file: string;
      changes: string;
      reasoning: string;
    }>;
    codeSnippets?: Array<{
      language: string;
      code: string;
      description: string;
    }>;
    estimatedTime: string;
    taskMetadata?: {
      commitMessage: string;
      branchName: string;
      testingNotes: string;
    };
  };
  error?: string;
  taskId?: string;
  timestamp: string;
}

/**
 * Handle Dev AI requests
 * Analyzes code tasks and provides implementation guidance
 */
export async function handleDevAI(
  task: string,
  context: any,
  user: any
): Promise<DevAIResponse> {
  try {
    console.log('Dev AI processing task:', task.substring(0, 100));

    // Parse task details
    const taskAnalysis = await analyzeDevTask(task, context);
    
    // Get relevant code context
    const codeContext = await getCodeContext(taskAnalysis, context?.files);
    
    // Generate AI response
    const aiResponse = await generateDevSolution(
      task,
      taskAnalysis,
      codeContext,
      context
    );

    // Log the task
    await logDevTask(user.id, task, aiResponse);

    return {
      success: true,
      result: aiResponse,
      taskId: `dev-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Dev AI Error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Dev AI processing failed',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Analyze the development task
 */
async function analyzeDevTask(task: string, context: any) {
  // Keywords for task classification
  const patterns = {
    feature: /add|create|implement|build|develop|new feature/i,
    bugfix: /fix|bug|error|issue|problem|broken|not working/i,
    refactor: /refactor|clean|improve|optimize|restructure/i,
    optimization: /performance|speed|optimize|faster|reduce/i,
    review: /review|check|analyze|audit|assess/i
  };

  let taskType = 'feature'; // default
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(task)) {
      taskType = type;
      break;
    }
  }

  // Extract file references
  const filePattern = /\/([\w\-\/]+\.(tsx?|jsx?|css|json))/g;
  const mentionedFiles = [...task.matchAll(filePattern)].map(match => match[0]);

  // Extract component/function names
  const componentPattern = /<(\w+)\s*\/?>|(\w+)Component|function\s+(\w+)/g;
  const components = [...task.matchAll(componentPattern)]
    .map(match => match[1] || match[2] || match[3])
    .filter(Boolean);

  return {
    type: taskType,
    mentionedFiles,
    components,
    urgency: context?.priority || 'medium',
    requiresNewFiles: task.includes('create') || task.includes('new'),
    affectsMultipleFiles: mentionedFiles.length > 1 || task.includes('across') || task.includes('all')
  };
}

/**
 * Get relevant code context
 */
async function getCodeContext(taskAnalysis: any, providedFiles?: string[]) {
  const relevantFiles = [...(providedFiles || []), ...taskAnalysis.mentionedFiles];
  
  if (relevantFiles.length === 0) {
    return null;
  }

  // In production, this would fetch actual file contents
  // For now, return structure info
  return {
    files: relevantFiles,
    projectStructure: {
      framework: 'Next.js 14',
      styling: 'Tailwind CSS',
      database: 'Supabase',
      payments: 'Stripe',
      language: 'TypeScript'
    },
    designSystem: {
      colors: ['luxury-black', 'soft-white', 'warm-gray'],
      fonts: ['Bodoni Moda', 'Playfair Display', 'Inter'],
      components: ['Button', 'Card', 'Input', 'Dialog', 'Toast']
    }
  };
}

/**
 * Generate development solution using AI
 */
async function generateDevSolution(
  task: string,
  taskAnalysis: any,
  codeContext: any,
  context: any
): Promise<any> {
  // Build comprehensive prompt
  const systemPrompt = `You are Dev AI for SELFIE AI™ platform v4.
  
Brand Guidelines:
- Luxury editorial design: clean, minimal, elegant
- Typography: Bodoni Moda (headlines), Inter (body)
- Colors: #171719 (luxury-black), #F1F1F1 (soft-white), #B5B5B3 (warm-gray)
- No rounded corners, no gradients in UI, sharp edges only
- Mobile-first responsive design

Tech Stack:
- Next.js 14 with App Router
- TypeScript (strict mode)
- Tailwind CSS for styling
- Supabase for auth & database
- Stripe for payments
- Shadcn/ui components

Code Standards:
- Use modern React patterns (hooks, functional components)
- Implement proper error handling
- Add TypeScript types for all functions
- Follow SELFIE AI™ naming conventions
- Keep components small and focused
- Comment complex logic only`;

  const userPrompt = `Task: ${task}

Task Type: ${taskAnalysis.type}
Priority: ${taskAnalysis.urgency}
${taskAnalysis.mentionedFiles.length > 0 ? `Files mentioned: ${taskAnalysis.mentionedFiles.join(', ')}` : ''}
${taskAnalysis.components.length > 0 ? `Components: ${taskAnalysis.components.join(', ')}` : ''}

Additional Context: ${JSON.stringify(context?.previousResults || {})}

Please provide:
1. Analysis of the task
2. Step-by-step implementation plan
3. Code snippets for key changes
4. Suggested file modifications
5. Testing recommendations
6. Git commit message suggestion`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content!;
    
    // Parse AI response into structured format
    return parseDevAIResponse(response, taskAnalysis);

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback response
    return {
      analysis: 'Task analysis completed',
      suggestedChanges: [{
        file: taskAnalysis.mentionedFiles[0] || 'app/page.tsx',
        changes: `// ${taskAnalysis.type} implementation needed\n// Task: ${task.substring(0, 100)}`,
        reasoning: 'Manual implementation required'
      }],
      estimatedTime: taskAnalysis.type === 'feature' ? '2-4 hours' : '1-2 hours',
      taskMetadata: {
        commitMessage: `${taskAnalysis.type}: ${task.substring(0, 50)}`,
        branchName: `${taskAnalysis.type}/${task.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}`,
        testingNotes: 'Test all affected components and flows'
      }
    };
  }
}

/**
 * Parse AI response into structured format
 */
function parseDevAIResponse(response: string, taskAnalysis: any) {
  // Extract code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const codeSnippets = [];
  let match;
  
  while ((match = codeBlockRegex.exec(response)) !== null) {
    codeSnippets.push({
      language: match[1] || 'typescript',
      code: match[2].trim(),
      description: 'Implementation snippet'
    });
  }

  // Extract sections (simplified parsing)
  const sections = response.split(/\n\d+\.\s+/);
  const analysis = sections[1] || response.substring(0, 500);
  
  // Build structured response
  return {
    analysis: analysis.trim(),
    suggestedChanges: extractSuggestedChanges(response, taskAnalysis),
    codeSnippets,
    estimatedTime: extractEstimatedTime(response, taskAnalysis),
    taskMetadata: {
      commitMessage: extractCommitMessage(response, taskAnalysis),
      branchName: generateBranchName(taskAnalysis),
      testingNotes: extractTestingNotes(response)
    }
  };
}

/**
 * Extract suggested file changes from response
 */
function extractSuggestedChanges(response: string, taskAnalysis: any) {
  const changes: any[] = [];
  
  // Look for file mentions
  const filePattern = /(?:file:|modify|update|create)\s*(\/[\w\-\/]+\.\w+)/gi;
  const matches = [...response.matchAll(filePattern)];
  
  if (matches.length > 0) {
    matches.forEach(match => {
      changes.push({
        file: match[1],
        changes: `See implementation details above`,
        reasoning: `Part of ${taskAnalysis.type} implementation`
      });
    });
  } else {
    // Fallback to mentioned files
    taskAnalysis.mentionedFiles.forEach(file => {
      changes.push({
        file,
        changes: `Implement ${taskAnalysis.type} as described`,
        reasoning: `Required for task completion`
      });
    });
  }

  return changes.length > 0 ? changes : [{
    file: 'app/page.tsx',
    changes: 'Implement task requirements',
    reasoning: 'Primary implementation file'
  }];
}

/**
 * Extract estimated time from response
 */
function extractEstimatedTime(response: string, taskAnalysis: any) {
  const timePattern = /(\d+[-\s]?\d*)\s*(hours?|days?|minutes?)/i;
  const match = response.match(timePattern);
  
  if (match) {
    return match[0];
  }

  // Default estimates based on task type
  const estimates = {
    feature: '2-4 hours',
    bugfix: '1-2 hours',
    refactor: '3-5 hours',
    optimization: '2-3 hours',
    review: '30-60 minutes'
  };

  return estimates[taskAnalysis.type] || '2-3 hours';
}

/**
 * Extract or generate commit message
 */
function extractCommitMessage(response: string, taskAnalysis: any) {
  const commitPattern = /commit\s*message:?\s*["']?([^"'\n]+)/i;
  const match = response.match(commitPattern);
  
  if (match) {
    return match[1].trim();
  }

  // Generate based on task type
  const prefixes = {
    feature: 'feat:',
    bugfix: 'fix:',
    refactor: 'refactor:',
    optimization: 'perf:',
    review: 'chore:'
  };

  return `${prefixes[taskAnalysis.type]} ${taskAnalysis.type} implementation`;
}

/**
 * Generate branch name
 */
function generateBranchName(taskAnalysis: any) {
  const timestamp = Date.now();
  const cleanType = taskAnalysis.type.toLowerCase();
  
  return `${cleanType}/ai-${timestamp}`;
}

/**
 * Extract testing notes
 */
function extractTestingNotes(response: string) {
  const testPattern = /test(?:ing)?:?\s*([^\n]+)/i;
  const match = response.match(testPattern);
  
  return match ? match[1].trim() : 'Test all affected functionality';
}

/**
 * Log dev task for analytics
 */
async function logDevTask(userId: string, task: string, result: any) {
  try {
    await supabase.from('dev_tasks').insert({
      user_id: userId,
      task_summary: task.substring(0, 200),
      task_type: result.suggestedChanges?.[0]?.file ? 'code_change' : 'analysis',
      estimated_time: result.estimatedTime,
      status: 'completed',
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log dev task:', error);
  }
}

/**
 * Helper: Format code for SELFIE AI™ standards
 */
export function formatCodeForBrand(code: string): string {
  // Apply SELFIE AI™ coding standards
  return code
    .replace(/border-radius:\s*\d+px/g, 'border-radius: 0') // No rounded corners
    .replace(/rounded-\w+/g, '') // Remove Tailwind rounded classes
    .replace(/gradient/gi, '') // No gradients
    .replace(/shadow-\w+/g, '') // Minimal shadows
    .trim();
}

/**
 * Helper: Validate TypeScript code
 */
export function validateTypeScriptCode(code: string): boolean {
  // Basic validation checks
  const hasTypes = /:\s*(string|number|boolean|any|void|\{|\[)/g.test(code);
  const hasProperImports = /^import\s+.+\s+from\s+['"].+['"]/gm.test(code);
  const hasExports = /export\s+(default\s+)?/g.test(code);
  
  return hasTypes || hasProperImports || hasExports;
}