import { z } from 'zod'

// Types
export interface MakeScenario {
  id: string
  name: string
  description?: string
  teamId: string
  isActive: boolean
  isPaused: boolean
  scheduling?: 'manually' | 'instantly' | 'interval'
  interval?: number
  lastRun?: string
  createdAt: string
  updatedAt: string
}

export interface MakeModule {
  id: string
  name: string
  type: string
  position: { x: number; y: number }
  parameters?: Record<string, any>
}

export interface MakeConnection {
  source: string
  target: string
}

export interface EmailConfig {
  to: string
  subject: string
  html: string
  from?: string
}

export interface DelayConfig {
  amount: number
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
}

export interface SupabaseConfig {
  action: 'insert' | 'update' | 'select'
  table: string
  data?: any
  filters?: Record<string, any>
}

// Configuration
const MAKE_API_BASE = 'https://eu2.make.com/api/v2'
const ORGANIZATION_ID = '4272101'
const TEAM_ID = '2082222'

// Headers for all requests
const getHeaders = () => ({
  'Authorization': `Bearer ${process.env.MAKE_API_TOKEN}`,
  'Content-Type': 'application/json',
})

// Error handling
class MakeAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message)
    this.name = 'MakeAPIError'
  }
}

// Helper function for API requests
async function makeRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${MAKE_API_BASE}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new MakeAPIError(
        data.message || `API request failed: ${response.statusText}`,
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof MakeAPIError) {
      throw error
    }
    throw new MakeAPIError(`Network error: ${error.message}`)
  }
}

// Core Functions

/**
 * List all scenarios in the organization
 */
export async function listMakeScenarios(): Promise<MakeScenario[]> {
  const response = await makeRequest<{ scenarios: MakeScenario[] }>(
    `/organizations/${ORGANIZATION_ID}/scenarios`
  )
  return response.scenarios || []
}

/**
 * Create a new scenario
 */
export async function createMakeScenario(
  name: string,
  description: string,
  options?: {
    scheduling?: 'manually' | 'instantly' | 'interval'
    interval?: number
  }
): Promise<MakeScenario> {
  const payload = {
    name,
    description,
    teamId: TEAM_ID,
    scheduling: options?.scheduling || 'manually',
    ...(options?.interval && { interval: options.interval }),
  }

  return await makeRequest<MakeScenario>(
    `/organizations/${ORGANIZATION_ID}/scenarios`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}

/**
 * Get scenario details
 */
export async function getScenarioDetails(scenarioId: string): Promise<MakeScenario> {
  return await makeRequest<MakeScenario>(
    `/scenarios/${scenarioId}`
  )
}

/**
 * Add webhook module to scenario
 */
export async function addWebhookModule(
  scenarioId: string,
  webhookName: string
): Promise<MakeModule> {
  const payload = {
    name: webhookName,
    type: 'webhook',
    position: { x: 100, y: 100 },
    parameters: {
      webhook: {
        name: webhookName,
        immediate: true,
      },
    },
  }

  return await makeRequest<MakeModule>(
    `/scenarios/${scenarioId}/modules`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}

/**
 * Add email module (Resend)
 */
export async function addEmailModule(
  scenarioId: string,
  config: EmailConfig
): Promise<MakeModule> {
  const payload = {
    name: 'Send Email',
    type: 'resend',
    position: { x: 300, y: 100 },
    parameters: {
      to: config.to,
      subject: config.subject,
      html: config.html,
      from: config.from || 'noreply@selfie-ai.com',
    },
  }

  return await makeRequest<MakeModule>(
    `/scenarios/${scenarioId}/modules`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}

/**
 * Add delay module
 */
export async function addDelayModule(
  scenarioId: string,
  delay: DelayConfig
): Promise<MakeModule> {
  const delayInSeconds = (() => {
    switch (delay.unit) {
      case 'seconds': return delay.amount
      case 'minutes': return delay.amount * 60
      case 'hours': return delay.amount * 3600
      case 'days': return delay.amount * 86400
      default: return delay.amount
    }
  })()

  const payload = {
    name: `Delay ${delay.amount} ${delay.unit}`,
    type: 'tools',
    subtype: 'delay',
    position: { x: 500, y: 100 },
    parameters: {
      delay: delayInSeconds,
    },
  }

  return await makeRequest<MakeModule>(
    `/scenarios/${scenarioId}/modules`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}

/**
 * Add Supabase module
 */
export async function addSupabaseModule(
  scenarioId: string,
  action: 'insert' | 'update' | 'select',
  table: string,
  data?: any
): Promise<MakeModule> {
  const payload = {
    name: `Supabase ${action} ${table}`,
    type: 'supabase',
    position: { x: 700, y: 100 },
    parameters: {
      action,
      table,
      ...(data && { data }),
      connectionId: process.env.MAKE_SUPABASE_CONNECTION_ID,
    },
  }

  return await makeRequest<MakeModule>(
    `/scenarios/${scenarioId}/modules`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}

/**
 * Add Slack module
 */
export async function addSlackModule(
  scenarioId: string,
  channel: string,
  message: string
): Promise<MakeModule> {
  const payload = {
    name: 'Send Slack Message',
    type: 'slack',
    position: { x: 900, y: 100 },
    parameters: {
      channel,
      text: message,
      connectionId: process.env.MAKE_SLACK_CONNECTION_ID,
    },
  }

  return await makeRequest<MakeModule>(
    `/scenarios/${scenarioId}/modules`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}

/**
 * Connect modules together
 */
export async function connectModules(
  scenarioId: string,
  sourceModuleId: string,
  targetModuleId: string
): Promise<MakeConnection> {
  const payload = {
    source: sourceModuleId,
    target: targetModuleId,
  }

  return await makeRequest<MakeConnection>(
    `/scenarios/${scenarioId}/connections`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )
}

/**
 * Activate/deactivate scenario
 */
export async function toggleScenario(
  scenarioId: string,
  active: boolean
): Promise<MakeScenario> {
  const payload = {
    isActive: active,
    isPaused: !active,
  }

  return await makeRequest<MakeScenario>(
    `/scenarios/${scenarioId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  )
}

/**
 * Run scenario manually
 */
export async function runScenario(
  scenarioId: string,
  data?: any
): Promise<{ executionId: string }> {
  return await makeRequest<{ executionId: string }>(
    `/scenarios/${scenarioId}/run`,
    {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }
  )
}

// Scenario Templates
export const scenarioTemplates = {
  'free-guide': {
    name: 'Free Guide Email Sequence',
    description: 'Automated email sequence for free guide downloads',
    modules: [
      { type: 'webhook', name: 'New Lead Trigger' },
      { type: 'email', subject: 'Your Free Selfie Guide is Here!', delay: 0 },
      { type: 'delay', amount: 2, unit: 'days' as const },
      { type: 'email', subject: 'Quick tip from your guide', delay: 0 },
      { type: 'delay', amount: 3, unit: 'days' as const },
      { type: 'email', subject: 'Ready for the next level?', delay: 0 }
    ]
  },
  'new-purchase': {
    name: 'New Purchase Automation',
    description: 'Handle new purchases from Stripe',
    modules: [
      { type: 'webhook', name: 'Stripe Purchase Webhook' },
      { type: 'supabase', action: 'update' as const, table: 'users' },
      { type: 'email', subject: 'Welcome to SELFIE AI™!' },
      { type: 'slack', channel: '#purchases', message: 'New purchase: {{email}}' }
    ]
  },
  'vip-application': {
    name: 'VIP Application Handler',
    description: 'Process VIP applications',
    modules: [
      { type: 'webhook', name: 'VIP Application' },
      { type: 'email', subject: 'VIP Application Received' },
      { type: 'slack', channel: '#vip', message: 'New VIP applicant: {{name}}' },
      { type: 'supabase', action: 'insert' as const, table: 'vip_applications' }
    ]
  }
}

/**
 * Create complete automation from template
 */
export async function createAutomationFromTemplate(
  template: keyof typeof scenarioTemplates
): Promise<{
  scenario: MakeScenario
  modules: MakeModule[]
  connections: MakeConnection[]
}> {
  const templateConfig = scenarioTemplates[template]
  if (!templateConfig) {
    throw new MakeAPIError(`Template "${template}" not found`)
  }

  // Create scenario
  const scenario = await createMakeScenario(
    templateConfig.name,
    templateConfig.description,
    {
      scheduling: template === 'free-guide' ? 'instantly' : 'manually'
    }
  )

  const modules: MakeModule[] = []
  const connections: MakeConnection[] = []
  let xPosition = 100

  try {
    // Create modules based on template
    for (let i = 0; i < templateConfig.modules.length; i++) {
      const moduleConfig = templateConfig.modules[i]
      let module: MakeModule

      switch (moduleConfig.type) {
        case 'webhook':
          module = await addWebhookModule(scenario.id, moduleConfig.name)
          break
          
        case 'email':
          module = await addEmailModule(scenario.id, {
            to: '{{email}}', // Using variable from webhook
            subject: moduleConfig.subject!,
            html: generateEmailTemplate(moduleConfig.subject!),
            from: 'Sandra <sandra@selfie-ai.com>'
          })
          break
          
        case 'delay':
          module = await addDelayModule(scenario.id, {
            amount: moduleConfig.amount!,
            unit: moduleConfig.unit!
          })
          break
          
        case 'supabase':
          module = await addSupabaseModule(
            scenario.id,
            moduleConfig.action!,
            moduleConfig.table!,
            moduleConfig.action === 'update' ? { subscription_status: 'active' } : {}
          )
          break
          
        case 'slack':
          module = await addSlackModule(
            scenario.id,
            moduleConfig.channel!,
            moduleConfig.message!
          )
          break
          
        default:
          throw new MakeAPIError(`Unknown module type: ${moduleConfig.type}`)
      }

      modules.push(module)
      
      // Connect to previous module
      if (i > 0) {
        const connection = await connectModules(
          scenario.id,
          modules[i - 1].id,
          module.id
        )
        connections.push(connection)
      }
      
      xPosition += 200
    }

    // Activate the scenario
    await toggleScenario(scenario.id, true)

    return { scenario, modules, connections }
  } catch (error) {
    // If something fails, try to clean up by deactivating the scenario
    try {
      await toggleScenario(scenario.id, false)
    } catch (cleanupError) {
      console.error('Failed to deactivate scenario during cleanup:', cleanupError)
    }
    throw error
  }
}

/**
 * Helper function to generate email HTML template
 */
function generateEmailTemplate(subject: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #171719; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-family: 'Bodoni Moda', serif; font-size: 32px; margin-bottom: 20px; }
    .button { 
      display: inline-block; 
      background: #171719; 
      color: #F1F1F1; 
      padding: 16px 40px; 
      text-decoration: none; 
      margin-top: 20px;
    }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #B5B5B3; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${subject}</h1>
    <p>Hey {{name}},</p>
    <p>[Email content will be customized based on the template]</p>
    <a href="{{cta_link}}" class="button">{{cta_text}}</a>
    <div class="footer">
      <p>xo,<br>Sandra</p>
      <p style="color: #B5B5B3; font-size: 14px;">
        SELFIE AI™ - Your selfie is your brand
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Test Make.com connection
 */
export async function testMakeConnection(): Promise<{
  success: boolean
  count?: number
  error?: string
}> {
  try {
    const scenarios = await listMakeScenarios()
    return { 
      success: true, 
      count: scenarios.length 
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Delete a scenario (use with caution)
 */
export async function deleteScenario(scenarioId: string): Promise<void> {
  await makeRequest(
    `/scenarios/${scenarioId}`,
    {
      method: 'DELETE',
    }
  )
}

/**
 * Get scenario execution history
 */
export async function getScenarioExecutions(
  scenarioId: string,
  limit: number = 10
): Promise<any[]> {
  const response = await makeRequest<{ executions: any[] }>(
    `/scenarios/${scenarioId}/executions?limit=${limit}`
  )
  return response.executions || []
}

// Export types for use in other files
export type ScenarioTemplate = keyof typeof scenarioTemplates
export type ModuleType = 'webhook' | 'email' | 'delay' | 'supabase' | 'slack' 