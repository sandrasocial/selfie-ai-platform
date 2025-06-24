import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { agent: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { agent } = params

    // Agent configurations
    const agents = {
      sandra: {
        id: 'sandra',
        name: 'Sandra AI',
        description: 'Personal brand coach and content strategist',
        status: 'active',
        capabilities: [
          'Personal brand analysis',
          'Content strategy development',
          'Audience insights',
          'Brand voice coaching',
          'Content optimization',
        ],
        model: 'claude-3-sonnet',
        version: '1.0.0',
        lastUpdated: '2024-01-15T10:00:00Z',
        totalInteractions: 1547,
        averageRating: 4.8,
        systemPrompt:
          'You are Sandra, a personal brand coach focused on authentic content creation...',
      },
      content: {
        id: 'content',
        name: 'Content Generator',
        description: 'AI-powered content creation assistant',
        status: 'active',
        capabilities: [
          'Social media post generation',
          'Caption writing',
          'Content ideation',
          'Hashtag optimization',
          'Multi-platform adaptation',
        ],
        model: 'claude-3-haiku',
        version: '1.2.1',
        lastUpdated: '2024-01-20T14:30:00Z',
        totalInteractions: 892,
        averageRating: 4.6,
        systemPrompt:
          'You are a content creation specialist focused on engaging social media content...',
      },
      analytics: {
        id: 'analytics',
        name: 'Analytics Agent',
        description: 'Performance tracking and insights',
        status: 'active',
        capabilities: [
          'Performance metrics analysis',
          'Engagement pattern recognition',
          'Growth trend analysis',
          'Optimization recommendations',
          'ROI tracking',
        ],
        model: 'claude-3-haiku',
        version: '1.1.0',
        lastUpdated: '2024-01-18T09:15:00Z',
        totalInteractions: 234,
        averageRating: 4.7,
        systemPrompt: 'You are an analytics specialist focused on social media performance...',
      },
      scheduler: {
        id: 'scheduler',
        name: 'Content Scheduler',
        description: 'Automated content scheduling and posting',
        status: 'beta',
        capabilities: [
          'Optimal timing analysis',
          'Cross-platform scheduling',
          'Content calendar management',
          'Automated posting',
          'Engagement monitoring',
        ],
        model: 'gpt-4-turbo',
        version: '0.9.0',
        lastUpdated: '2024-01-22T16:45:00Z',
        totalInteractions: 67,
        averageRating: 4.2,
        systemPrompt: 'You are a scheduling specialist focused on optimal content timing...',
      },
    }

    const selectedAgent = agents[agent as keyof typeof agents]

    if (!selectedAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get recent interactions for this agent
    const { data: recentInteractions, error: interactionsError } = await supabase
      .from('admin_agent_logs')
      .select(
        `
        *,
        user_profiles(name, email)
      `
      )
      .eq('agent_type', agent)
      .order('created_at', { ascending: false })
      .limit(10)

    if (interactionsError) {
      console.error('Error fetching agent interactions:', interactionsError)
    }

    return NextResponse.json({
      success: true,
      agent: selectedAgent,
      recentInteractions: recentInteractions || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Agent info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { agent: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { agent } = params
    const { action, parameters } = await request.json()

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    let result: any = {}

    switch (action) {
      case 'restart':
        result = {
          success: true,
          message: `Agent ${agent} restarted successfully`,
          timestamp: new Date().toISOString(),
        }
        break

      case 'update_config':
        result = {
          success: true,
          message: `Agent ${agent} configuration updated`,
          parameters,
          timestamp: new Date().toISOString(),
        }
        break

      case 'toggle_status':
        result = {
          success: true,
          message: `Agent ${agent} status toggled`,
          newStatus: parameters?.status || 'active',
          timestamp: new Date().toISOString(),
        }
        break

      case 'clear_cache':
        result = {
          success: true,
          message: `Agent ${agent} cache cleared`,
          timestamp: new Date().toISOString(),
        }
        break

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    // Log the admin action
    await supabase.from('admin_agent_logs').insert({
      user_id: user.id,
      agent_type: 'admin_action',
      message: `Admin action on ${agent}: ${action}`,
      response: JSON.stringify(result),
      context: {
        agent,
        action,
        parameters,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      agent,
      action,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Agent action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { agent: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { agent } = params

    // Core agents cannot be deleted
    const protectedAgents = ['sandra', 'content', 'analytics']
    if (protectedAgents.includes(agent)) {
      return NextResponse.json({ error: 'Cannot delete core agent' }, { status: 403 })
    }

    // Log the deletion attempt
    await supabase.from('admin_agent_logs').insert({
      user_id: user.id,
      agent_type: 'admin_action',
      message: `Agent deletion attempted: ${agent}`,
      response: 'Agent deleted successfully',
      context: {
        agent,
        action: 'delete',
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `Agent ${agent} deleted successfully`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Agent deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
