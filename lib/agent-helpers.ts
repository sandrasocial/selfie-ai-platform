import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Agent helper functions for easy integration

interface AgentTask {
  id?: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface CommitOptions {
  task?: AgentTask;
  filePath: string;
  content: string;
  agent: string;
  token: string;
}

interface AgentConfig {
  name: string;
  token: string;
  baseUrl?: string;
}

export class AgentHelper {
  private config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      ...config
    };
  }
  
  async commit({ filePath, content, task }: Omit<CommitOptions, 'agent' | 'token'>) {
    const response = await fetch(`${this.config.baseUrl}/api/admin/agents/${this.config.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.token}`
      },
      body: JSON.stringify({
        task,
        filePath,
        content,
        action: 'commit'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Commit failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async createBranch() {
    const response = await fetch(`${this.config.baseUrl}/api/admin/agents/${this.config.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.token}`
      },
      body: JSON.stringify({
        action: 'branch'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Branch creation failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async createPullRequest(title: string, description: string, sourceBranch: string) {
    const response = await fetch(`${this.config.baseUrl}/api/admin/agents/${this.config.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.token}`
      },
      body: JSON.stringify({
        action: 'pr',
        title,
        description,
        sourceBranch
      })
    });
    
    if (!response.ok) {
      throw new Error(`PR creation failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getTasks() {
    const response = await fetch(`${this.config.baseUrl}/api/admin/agents/${this.config.name}`, {
      headers: {
        'Authorization': `Bearer ${this.config.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// Pre-configured agent instances
export const agents = {
  diana: new AgentHelper({
    name: 'diana',
    token: process.env.AGENT_DIANA_TOKEN!
  }),
  
  victoria: new AgentHelper({
    name: 'victoria',
    token: process.env.AGENT_VICTORIA_TOKEN!
  }),
  
  rachel: new AgentHelper({
    name: 'rachel',
    token: process.env.AGENT_RACHEL_TOKEN!
  }),
  
  quinn: new AgentHelper({
    name: 'quinn',
    token: process.env.AGENT_QUINN_TOKEN!
  }),
  
  ava: new AgentHelper({
    name: 'ava',
    token: process.env.AGENT_AVA_TOKEN!
  })
};

// Task management helpers
export async function createTask(task: AgentTask & { assigned_to: string }) {
  const response = await fetch('/api/admin/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });
  
  if (!response.ok) {
    throw new Error(`Task creation failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function updateTask(id: string, updates: Partial<AgentTask>) {
  const response = await fetch('/api/admin/tasks', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, ...updates })
  });
  
  if (!response.ok) {
    throw new Error(`Task update failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getTasks(filters?: { agent?: string; status?: string }) {
  const params = new URLSearchParams(filters as any);
  const response = await fetch(`/api/admin/tasks?${params}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  
  return response.json();
}

// Example usage scripts for each agent
export const agentScripts = {
  // Victoria (UX Agent) example: Create a new component
  victoriaCreateComponent: async (componentName: string, componentCode: string) => {
    return agents.victoria.commit({
      filePath: `components/ui/${componentName}.tsx`,
      content: componentCode,
      task: {
        title: `Create ${componentName} component`,
        description: `New UI component following SELFIE AI design system`
      }
    });
  },
  
  // Rachel (Voice Agent) example: Update copy
  rachelUpdateCopy: async (pagePath: string, newCopy: string) => {
    return agents.rachel.commit({
      filePath: `content/${pagePath}.md`,
      content: newCopy,
      task: {
        title: `Update ${pagePath} copy`,
        description: `Rewrite in Sandra's voice - Rachel from FRIENDS style`
      }
    });
  },
  
  // Quinn (QA Agent) example: Add test
  quinnAddTest: async (testPath: string, testCode: string) => {
    return agents.quinn.commit({
      filePath: `__tests__/${testPath}.test.ts`,
      content: testCode,
      task: {
        title: `Add tests for ${testPath}`,
        description: `Comprehensive test coverage for component/feature`
      }
    });
  },
  
  // AVA (Automation Agent) example: Add workflow
  avaAddWorkflow: async (workflowName: string, config: string) => {
    return agents.ava.commit({
      filePath: `.github/workflows/${workflowName}.yml`,
      content: config,
      task: {
        title: `Add ${workflowName} workflow`,
        description: `Automated workflow for CI/CD or other processes`
      }
    });
  }
}; 