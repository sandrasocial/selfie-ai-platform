import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

    const { message, context } = await request.json()
    const { agent } = params

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Simulate agent response based on agent type
    let agentResponse = ''

    switch (agent) {
      case 'sandra':
        agentResponse = `Sandra AI: I understand you're asking about "${message}". As your personal brand coach, I'd suggest focusing on authentic content creation that aligns with your core values. Would you like me to help you develop a content strategy?`
        break
      case 'content':
        agentResponse = `Content Agent: Based on your message "${message}", I can help you create engaging content. Let me suggest some post ideas that would resonate with your audience and boost engagement.`
        break
      case 'analytics':
        agentResponse = `Analytics Agent: Analyzing your request "${message}". I can provide insights on performance metrics, audience engagement patterns, and optimization recommendations for your content strategy.`
        break
      default:
        agentResponse = `AI Agent: I received your message "${message}". How can I assist you today?`
    }

    // Log the interaction for admin monitoring
    await supabase
      .from('admin_agent_logs')
      .insert({
        user_id: user.id,
        agent_type: agent,
        message,
        response: agentResponse,
        context: context || {},
        created_at: new Date().toISOString(),
      })
      .select()

    return NextResponse.json({
      success: true,
      response: agentResponse,
      agent,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Agent chat error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    // Return agent information
    const agentInfo = {
      sandra: {
        name: 'Sandra AI',
        description: 'Personal brand coach and content strategist',
        capabilities: ['Content strategy', 'Brand guidance', 'Audience insights'],
        status: 'active',
      },
      content: {
        name: 'Content Agent',
        description: 'AI-powered content creation assistant',
        capabilities: ['Post generation', 'Caption writing', 'Content optimization'],
        status: 'active',
      },
      analytics: {
        name: 'Analytics Agent',
        description: 'Performance tracking and insights',
        capabilities: ['Metrics analysis', 'Trend identification', 'Optimization recommendations'],
        status: 'active',
      },
    }

    const selectedAgent = agentInfo[agent as keyof typeof agentInfo]

    if (!selectedAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({
      agent: selectedAgent,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Agent info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
