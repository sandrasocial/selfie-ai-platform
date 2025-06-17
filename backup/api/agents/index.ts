// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Import individual agent handlers
import { handleDevAI } from './dev';
import { handleUXAI } from './ux';
import { handleQAAI } from './qa';
import { handleAutomationAI } from './automation';
import { handleVoiceAI } from './voice';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Request schema validation
const AgentRequestSchema = z.object({
  agentType: z.enum(['dev', 'ux', 'qa', 'automation', 'voice', 'director']),
  task: z.string().min(1).max(5000),
  context: z.object({
    files: z.array(z.string()).optional(),
    previousResults: z.any().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium')
  }).optional()
});

// Response type definition
interface AgentResponse {
  success: boolean;
  result?: any;
  error?: string;
  taskId?: string;
  timestamp: string;
}

/**
 * Rate limiting middleware
 * Limits: 100 requests per hour per user
 */
async function checkRateLimit(userId: string): Promise<boolean> {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetAt) {
    rateLimitStore.set(userId, {
      count: 1,
      resetAt: now + hourInMs
    });
    return true;
  }
  
  if (userLimit.count >= 100) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

/**
 * Main agent request handler
 * Routes requests to appropriate AI agent based on type
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing authorization token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify user session with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Check rate limit
    const withinLimit = await checkRateLimit(user.id);
    if (!withinLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Maximum 100 requests per hour.' 
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = AgentRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request format',
          details: validationResult.error.flatten()
        },
        { status: 400 }
      );
    }

    const { agentType, task, context } = validationResult.data;

    // Log agent request for analytics
    await supabase.from('agent_requests').insert({
      user_id: user.id,
      agent_type: agentType,
      task_summary: task.substring(0, 100),
      priority: context?.priority || 'medium',
      created_at: new Date().toISOString()
    });

    // Route to appropriate agent handler
    let result: AgentResponse;
    
    switch (agentType) {
      case 'dev':
        result = await handleDevAI(task, context, user);
        break;
      
      case 'ux':
        result = await handleUXAI(task, context, user);
        break;
      
      case 'qa':
        result = await handleQAAI(task, context, user);
        break;
      
      case 'automation':
        result = await handleAutomationAI(task, context, user);
        break;
      
      case 'voice':
        result = await handleVoiceAI(task, context, user);
        break;
      
      case 'director':
        // Director AI orchestrates multiple agents
        result = await handleDirectorAI(task, context, user);
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown agent type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Agent API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Director AI Handler
 * Orchestrates multiple agents for complex tasks
 */
async function handleDirectorAI(
  task: string, 
  context: any, 
  user: any
): Promise<AgentResponse> {
  try {
    // Analyze task complexity
    const taskAnalysis = await analyzeTaskComplexity(task);
    
    // Determine which agents to engage
    const agentPlan = await createAgentExecutionPlan(taskAnalysis);
    
    // Execute plan with appropriate agents
    const results = await executeAgentPlan(agentPlan, task, context, user);
    
    return {
      success: true,
      result: {
        plan: agentPlan,
        results: results,
        summary: await synthesizeResults(results)
      },
      taskId: `director-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Director AI Error:', error);
    return {
      success: false,
      error: 'Director AI processing failed',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Helper: Analyze task complexity for Director AI
 */
async function analyzeTaskComplexity(task: string) {
  // Simple keyword-based analysis (extend with AI in production)
  const keywords = {
    dev: ['code', 'implement', 'fix', 'bug', 'feature', 'api', 'database'],
    ux: ['design', 'layout', 'ui', 'user interface', 'style', 'responsive'],
    qa: ['test', 'verify', 'check', 'validate', 'quality', 'bug'],
    automation: ['automate', 'workflow', 'integrate', 'stripe', 'email'],
    voice: ['copy', 'content', 'tone', 'brand', 'message', 'text']
  };
  
  const relevantAgents = [];
  
  for (const [agent, words] of Object.entries(keywords)) {
    if (words.some(word => task.toLowerCase().includes(word))) {
      relevantAgents.push(agent);
    }
  }
  
  return {
    complexity: relevantAgents.length > 2 ? 'high' : 'medium',
    relevantAgents,
    estimatedDuration: relevantAgents.length * 30 // seconds
  };
}

/**
 * Helper: Create execution plan for multiple agents
 */
async function createAgentExecutionPlan(analysis: any) {
  const { relevantAgents, complexity } = analysis;
  
  // Define execution order based on dependencies
  const executionOrder = {
    ux: 1,      // UX first for design decisions
    dev: 2,     // Dev implements based on UX
    qa: 3,      // QA tests implementation
    voice: 4,   // Voice refines copy
    automation: 5 // Automation last for workflows
  };
  
  const plan = relevantAgents
    .sort((a, b) => executionOrder[a] - executionOrder[b])
    .map(agent => ({
      agent,
      order: executionOrder[agent],
      dependencies: getAgentDependencies(agent)
    }));
  
  return {
    steps: plan,
    parallel: complexity === 'low', // Run in parallel for simple tasks
    totalAgents: plan.length
  };
}

/**
 * Helper: Get agent dependencies
 */
function getAgentDependencies(agent: string): string[] {
  const dependencies = {
    dev: ['ux'],
    qa: ['dev'],
    voice: ['ux', 'dev'],
    automation: ['dev', 'qa']
  };
  
  return dependencies[agent] || [];
}

/**
 * Helper: Execute the agent plan
 */
async function executeAgentPlan(plan: any, task: string, context: any, user: any) {
  const results = {};
  
  for (const step of plan.steps) {
    // Include previous results in context for dependent agents
    const enhancedContext = {
      ...context,
      previousResults: results
    };
    
    switch (step.agent) {
      case 'dev':
        results['dev'] = await handleDevAI(task, enhancedContext, user);
        break;
      case 'ux':
        results['ux'] = await handleUXAI(task, enhancedContext, user);
        break;
      case 'qa':
        results['qa'] = await handleQAAI(task, enhancedContext, user);
        break;
      case 'automation':
        results['automation'] = await handleAutomationAI(task, enhancedContext, user);
        break;
      case 'voice':
        results['voice'] = await handleVoiceAI(task, enhancedContext, user);
        break;
    }
  }
  
  return results;
}

/**
 * Helper: Synthesize results from multiple agents
 */
async function synthesizeResults(results: any) {
  const summary = {
    overallSuccess: Object.values(results).every((r: any) => r.success),
    completedAgents: Object.keys(results).filter(k => results[k].success),
    failedAgents: Object.keys(results).filter(k => !results[k].success),
    keyFindings: [],
    nextSteps: []
  };
  
  // Extract key findings from each agent
  for (const [agent, result] of Object.entries(results)) {
    if (result.success && result.result) {
      summary.keyFindings.push({
        agent,
        finding: extractKeyFinding(result.result)
      });
    }
  }
  
  return summary;
}

/**
 * Helper: Extract key finding from agent result
 */
function extractKeyFinding(result: any): string {
  // Simplified extraction - enhance with AI summarization
  if (typeof result === 'string') {
    return result.substring(0, 200) + '...';
  }
  
  if (result.summary) {
    return result.summary;
  }
  
  return JSON.stringify(result).substring(0, 200) + '...';
}

// Health check endpoint
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    status: 'healthy',
    service: 'SELFIE AI™ Agent API',
    version: '4.0',
    timestamp: new Date().toISOString()
  });
}