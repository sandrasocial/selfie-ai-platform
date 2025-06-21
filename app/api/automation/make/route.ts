import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  listMakeScenarios,
  createMakeScenario,
  createAutomationFromTemplate,
  toggleScenario,
  testMakeConnection,
  getScenarioExecutions,
  addWebhookModule,
  addEmailModule,
  addDelayModule,
  addSupabaseModule,
  connectModules,
  ScenarioTemplate
} from '@/lib/make-integration'

// Request validation schemas
const ListScenariosSchema = z.object({
  action: z.literal('list')
})

const CreateScenarioSchema = z.object({
  action: z.literal('create'),
  name: z.string(),
  description: z.string(),
  scheduling: z.enum(['manually', 'instantly', 'interval']).optional(),
  interval: z.number().optional()
})

const CreateFromTemplateSchema = z.object({
  action: z.literal('create-from-template'),
  template: z.enum(['free-guide', 'new-purchase', 'vip-application'])
})

const ToggleScenarioSchema = z.object({
  action: z.literal('toggle'),
  scenarioId: z.string(),
  active: z.boolean()
})

const TestConnectionSchema = z.object({
  action: z.literal('test')
})

const GetExecutionsSchema = z.object({
  action: z.literal('executions'),
  scenarioId: z.string(),
  limit: z.number().optional()
})

const BuildCustomScenarioSchema = z.object({
  action: z.literal('build-custom'),
  name: z.string(),
  description: z.string(),
  modules: z.array(z.object({
    type: z.enum(['webhook', 'email', 'delay', 'supabase', 'slack']),
    config: z.any()
  }))
})

// Main API handler
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate agent authorization (if needed)
    const agentName = request.headers.get('X-Agent-Name')
    if (agentName !== 'AVA' && agentName !== 'System') {
      return NextResponse.json(
        { error: 'Only AVA can access automation endpoints' },
        { status: 403 }
      )
    }

    // Handle different actions
    if (body.action === 'list') {
      const validated = ListScenariosSchema.parse(body)
      const scenarios = await listMakeScenarios()
      return NextResponse.json({ success: true, scenarios })
    }

    if (body.action === 'create') {
      const validated = CreateScenarioSchema.parse(body)
      const scenario = await createMakeScenario(
        validated.name,
        validated.description,
        {
          scheduling: validated.scheduling,
          interval: validated.interval
        }
      )
      return NextResponse.json({ success: true, scenario })
    }

    if (body.action === 'create-from-template') {
      const validated = CreateFromTemplateSchema.parse(body)
      const result = await createAutomationFromTemplate(validated.template)
      return NextResponse.json({ success: true, ...result })
    }

    if (body.action === 'toggle') {
      const validated = ToggleScenarioSchema.parse(body)
      const scenario = await toggleScenario(validated.scenarioId, validated.active)
      return NextResponse.json({ success: true, scenario })
    }

    if (body.action === 'test') {
      const result = await testMakeConnection()
      return NextResponse.json(result)
    }

    if (body.action === 'executions') {
      const validated = GetExecutionsSchema.parse(body)
      const executions = await getScenarioExecutions(
        validated.scenarioId,
        validated.limit
      )
      return NextResponse.json({ success: true, executions })
    }

    if (body.action === 'build-custom') {
      const validated = BuildCustomScenarioSchema.parse(body)
      
      // Create the scenario
      const scenario = await createMakeScenario(
        validated.name,
        validated.description
      )
      
      const modules: any[] = []
      let previousModuleId: string | null = null
      
      // Build modules step by step
      for (const moduleConfig of validated.modules) {
        let module: any
        
        switch (moduleConfig.type) {
          case 'webhook':
            module = await addWebhookModule(
              scenario.id,
              moduleConfig.config.name
            )
            break
            
          case 'email':
            module = await addEmailModule(
              scenario.id,
              moduleConfig.config
            )
            break
            
          case 'delay':
            module = await addDelayModule(
              scenario.id,
              moduleConfig.config
            )
            break
            
          case 'supabase':
            module = await addSupabaseModule(
              scenario.id,
              moduleConfig.config.action,
              moduleConfig.config.table,
              moduleConfig.config.data
            )
            break
            
          default:
            throw new Error(`Unknown module type: ${moduleConfig.type}`)
        }
        
        modules.push(module)
        
        // Connect to previous module
        if (previousModuleId) {
          await connectModules(scenario.id, previousModuleId, module.id)
        }
        
        previousModuleId = module.id
      }
      
      // Activate the scenario
      await toggleScenario(scenario.id, true)
      
      return NextResponse.json({ 
        success: true, 
        scenario,
        modules,
        message: `Created and activated scenario "${validated.name}" with ${modules.length} modules`
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Make.com API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process automation request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  try {
    const result = await testMakeConnection()
    return NextResponse.json({
      ...result,
      message: result.success 
        ? `Connected! Found ${result.count} scenarios.`
        : 'Connection failed'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 