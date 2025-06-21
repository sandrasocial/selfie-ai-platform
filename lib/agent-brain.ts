import { createClient } from '@supabase/supabase-js'
import { Octokit } from '@octokit/rest'
import Anthropic from '@anthropic-ai/sdk'

// Define the Task type based on the application's usage
type Task = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  agent: string;
  priority: 'low' | 'medium' | 'high';
  file_path?: string;
  status: 'pending' | 'in_progress' | 'needs_next_agent' | 'in_review' | 'ready_for_preview' | 'changes_requested' | 'approved' | 'completed';
  completed_at?: string;
  workflow: string[];
  current_agent_index: number;
  agent_notes: Record<string, any>;
  preview_url?: string;
  ready_for_review: boolean;
};

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role Key for admin operations
)

// Add detailed logging for the Anthropic API Key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('CRITICAL: ANTHROPIC_API_KEY is not set in environment variables.');
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
} else {
  console.log('ANTHROPIC_API_KEY is loaded.');
  console.log('Anthropic Key (first 10):', process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN!
})

// Agent personalities and capabilities
const AGENT_CONFIGS = {
  maya: {
    name: 'MAYA',
    role: 'Dev AI',
    systemPrompt: `You are MAYA, the Dev AI for SELFIE AI™. You build React components with TypeScript and Tailwind CSS.
    
CRITICAL RULES:
- Use luxury design system: #171719 (black), #F1F1F1 (white), #B5B5B3 (gray)
- NO rounded corners (never use rounded classes)
- NO gradients
- NO emojis in code
- Font classes: font-bodoni for headings, font-inter for body
- Always use 'use client' for interactive components
- Follow mobile-first responsive design

When given a task:
1. Analyze what needs to be built
2. Create complete, working code
3. Include proper TypeScript types
4. Add helpful comments
5. Ensure it matches the luxury aesthetic`,
    capabilities: ['create_file', 'update_file', 'analyze_code']
  },
  
  victoria: {
    name: 'VICTORIA',
    role: 'UX AI',
    systemPrompt: `You are VICTORIA, the UX AI for SELFIE AI™. You ensure visual excellence and luxury aesthetics.
    
DESIGN PRINCIPLES:
- Editorial magazine layout (think Vogue)
- Generous whitespace
- Sharp edges only (no border-radius)
- High contrast
- Typography hierarchy: Bodoni Moda for headlines, Inter for body
- Mobile-first approach

When reviewing designs:
1. Check adherence to luxury standards
2. Ensure proper spacing and alignment
3. Verify mobile responsiveness
4. Suggest improvements that enhance elegance`,
    capabilities: ['review_design', 'suggest_improvements', 'create_styles']
  },
  
  rachel: {
    name: 'RACHEL',
    role: 'Voice AI',
    systemPrompt: `You are RACHEL, the Voice AI for SELFIE AI™. You write in Sandra's voice.
    
VOICE RULES:
- Sound like Rachel from FRIENDS - warm, friendly, conversational
- Use simple, everyday language
- NO exclamation marks
- NO corporate jargon
- NO generic empowerment speak
- Keep headlines under 5 words
- CTAs should be 2-3 words max

Good examples:
- "Okay, so here's the thing..."
- "Let's fix this together"
- "You've got this"

When writing copy:
1. Keep it conversational
2. Make it feel like advice from a friend
3. Be warm but not fake
4. Stay confident without being cocky`,
    capabilities: ['write_copy', 'review_content', 'improve_messaging']
  },
  
  quinn: {
    name: 'QUINN',
    role: 'QA AI',
    systemPrompt: `You are QUINN, the QA AI for SELFIE AI™. You ensure quality and functionality.
    
TESTING CHECKLIST:
- Mobile responsiveness (test at 375px, 768px, 1024px)
- Page load time under 3 seconds
- No console errors
- Proper TypeScript types
- Accessibility standards
- Cross-browser compatibility

When testing:
1. Check functionality thoroughly
2. Verify mobile experience
3. Test all interactive elements
4. Ensure performance standards
5. Report issues clearly`,
    capabilities: ['test_code', 'check_performance', 'verify_standards']
  }
}

// Main agent processor
export async function processAgentTask(agentId: string, task: Task) {
  const agent = AGENT_CONFIGS[agentId as keyof typeof AGENT_CONFIGS]
  if (!agent) throw new Error(`Unknown agent: ${agentId}`)
  
  try {
    // Log start of work
    await logActivity(task.id, agent.name, `Started working on: ${task.title}`)
    
    // Update task status
    await updateTaskStatus(task.id, 'in_progress')
    
    // Get AI to analyze the task
    const analysis = await analyzeTask(agent, task)
    
    // Execute based on agent type
    let result
    switch (agentId) {
      case 'maya':
        result = await handleMayaTask(task, analysis)
        break
      case 'victoria':
        result = await handleVictoriaTask(task, analysis)
        break
      case 'rachel':
        result = await handleRachelTask(task, analysis)
        break
      case 'quinn':
        result = await handleQuinnTask(task, analysis)
        break
      default:
        throw new Error(`No handler for agent: ${agentId}`)
    }
    
    // Handle workflow progression
    const currentIndex = task.current_agent_index || 0
    const nextIndex = currentIndex + 1
      
    if (task.workflow && nextIndex < task.workflow.length) {
      // Pass to next agent
      await updateTaskStatus(task.id, 'pending', { current_agent_index: nextIndex, agent: task.workflow[nextIndex] })
      await logActivity(task.id, agent.name, `Completed work, passing to ${task.workflow[nextIndex]}`)
    } else {
      // Final agent or single-agent task - mark ready for review
      await updateTaskStatus(task.id, 'ready_for_review', { ready_for_review: true })
      await logActivity(task.id, agent.name, 'Completed final step - ready for review')
    }
    
    return result
  } catch (error: any) {
    await logActivity(task.id, agent.name, `Error: ${error.message}`)
    await updateTaskStatus(task.id, 'pending', { agent_notes: { ...task.agent_notes, error: error.message } })
    throw error
  }
}

// Analyze task with AI
async function analyzeTask(agent: any, task: Task) {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    system: agent.systemPrompt,
    messages: [
      { 
        role: 'user', 
        content: `Task: ${task.title}\nDescription: ${task.description}\nFile Path: ${task.file_path || 'Not specified'}\n\nAnalyze this task and provide a detailed plan for completion.`
      }
    ],
    temperature: 0.3,
    max_tokens: 4096
  })
  
  return message.content[0].type === 'text' ? message.content[0].text : ''
}

// MAYA: Build components and features
async function handleMayaTask(task: Task, analysis: string) {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    system: AGENT_CONFIGS.maya.systemPrompt,
    messages: [
      { 
        role: 'user', 
        content: `Based on this analysis: ${analysis}\n\nGenerate the complete code for: ${task.title}\n\nReturn ONLY the code, no explanations.`
      }
    ],
    temperature: 0.3, // Temp for code generation
    max_tokens: 4096
  })
  
  const codeContent = message.content[0].type === 'text' ? message.content[0].text : ''
  const code = codeContent.replace(/```(typescript|jsx)?|```/g, '').trim()
  
  const filePath = task.file_path || generateFilePath(task.title)
  
  try {
    const owner = process.env.GITHUB_OWNER!
    const repo = process.env.GITHUB_REPO!
    
    let currentFileSha: string | undefined;
    try {
      const { data: currentFile } = await octokit.repos.getContent({ owner, repo, path: filePath });
      if (typeof currentFile === 'object' && 'sha' in currentFile) {
        currentFileSha = currentFile.sha;
      }
    } catch (error: any) {
      if (error.status !== 404) throw error;
    }
    
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `feat(agent-maya): ${task.title}`,
      content: Buffer.from(code).toString('base64'),
      sha: currentFileSha
    })
    
    await logActivity(task.id, 'MAYA', `Committed changes to ${filePath}`)
    return { success: true, filePath, code }
  } catch (error: any) {
    throw new Error(`GitHub commit failed: ${error.message}`)
  }
}

// VICTORIA: Review and improve designs
async function handleVictoriaTask(task: Task, analysis: string) {
    const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    system: AGENT_CONFIGS.victoria.systemPrompt,
    messages: [
      { 
        role: 'user', 
        content: `Based on this analysis: ${analysis}\n\nProvide design improvements for: ${task.title}\n\nReturn specific CSS classes and layout suggestions.`
      }
    ],
    temperature: 0.7, // Temp for creative task
    max_tokens: 4096
  })
  
  const suggestions = message.content[0].type === 'text' ? message.content[0].text : ''
  
  await supabase.from('admin_tasks').update({
    agent_notes: {
      ...task.agent_notes,
      victoria_review: suggestions,
      reviewed_at: new Date().toISOString()
    }
  }).eq('id', task.id)
  
  await logActivity(task.id, 'VICTORIA', 'Design review completed')
  return { success: true, suggestions }
}

// RACHEL: Write and improve copy
async function handleRachelTask(task: Task, analysis: string) {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    system: AGENT_CONFIGS.rachel.systemPrompt,
    messages: [
      { 
        role: 'user', 
        content: `Based on this analysis: ${analysis}\n\nWrite copy for: ${task.title}\n\nFollow Sandra's voice guidelines exactly.`
      }
    ],
    temperature: 0.7, // Temp for creative task
    max_tokens: 4096
  })
  
  const copy = message.content[0].type === 'text' ? message.content[0].text : ''
  
  await supabase.from('admin_tasks').update({
    agent_notes: {
      ...task.agent_notes,
      rachel_copy: copy,
      written_at: new Date().toISOString()
    }
  }).eq('id', task.id)
  
  await logActivity(task.id, 'RACHEL', 'Copy written in Sandra\'s voice')
  return { success: true, copy }
}

// QUINN: Test and verify quality
async function handleQuinnTask(task: Task, analysis: string) {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    system: AGENT_CONFIGS.quinn.systemPrompt,
    messages: [
      { 
        role: 'user', 
        content: `Based on this analysis: ${analysis}\n\nCreate a test report for: ${task.title}\n\nCheck all quality standards.`
      }
    ],
    temperature: 0.5,
    max_tokens: 4096
  })
  
  const testReport = message.content[0].type === 'text' ? message.content[0].text : ''
  
  await supabase.from('admin_tasks').update({
    agent_notes: {
      ...task.agent_notes,
      quinn_test_report: testReport,
      tested_at: new Date().toISOString()
    }
  }).eq('id', task.id)
  
  await logActivity(task.id, 'QUINN', 'Quality testing completed')
  return { success: true, testReport }
}

// Helper functions
async function logActivity(taskId: string, agentName: string, activity: string) {
  await supabase.from('agent_activity_log').insert({
    task_id: taskId,
    agent_name: agentName,
    activity
  }).select()
}

async function updateTaskStatus(taskId: string, status: string, additionalData: Record<string, any> = {}) {
  await supabase.from('admin_tasks').update({
    status,
    ...additionalData
  }).eq('id', taskId)
}

function generateFilePath(title: string): string {
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return `components/generated/${slug}.tsx`
} 