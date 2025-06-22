import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/utils/supabase/route-handler';

export async function POST(request: NextRequest) {
  try {
    const { fromAgent, toAgent, conversationId, taskDescription, deliverables } = await request.json();
    const supabase = createRouteHandlerClient();

    // Create handoff record
    const { data: handoff, error: handoffError } = await supabase
      .from('agent_handoffs')
      .insert({
        from_agent: fromAgent,
        to_agent: toAgent,
        conversation_id: conversationId,
        task_description: taskDescription,
        deliverables: deliverables,
        status: 'active'
      })
      .select()
      .single();

    if (handoffError) {
      console.error('Error creating handoff:', handoffError);
      return NextResponse.json({ error: 'Failed to create handoff' }, { status: 500 });
    }

    // Create new conversation for receiving agent
    const { data: newConversation, error: conversationError } = await supabase
      .from('agent_conversations')
      .insert({
        agent_name: toAgent,
        user_id: 'admin', // Replace with actual user when auth is implemented
        metadata: {
          handoff_from: fromAgent,
          handoff_id: handoff.id,
          original_conversation: conversationId
        }
      })
      .select()
      .single();

    if (conversationError) {
      console.error('Error creating new conversation:', conversationError);
      return NextResponse.json({ error: 'Failed to create new conversation' }, { status: 500 });
    }

    // Add handoff message to new conversation
    const handoffMessage = `Task handed off from ${fromAgent} to ${toAgent}.\n\nTask: ${taskDescription}\n\nPrevious work: ${JSON.stringify(deliverables, null, 2)}`;

    const { error: messageError } = await supabase
      .from('agent_messages')
      .insert({
        conversation_id: newConversation.id,
        role: 'system',
        content: handoffMessage,
        agent_name: toAgent,
        metadata: {
          handoff_id: handoff.id,
          from_agent: fromAgent
        }
      });

    if (messageError) {
      console.error('Error creating handoff message:', messageError);
      return NextResponse.json({ error: 'Failed to create handoff message' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      handoffId: handoff.id,
      newConversationId: newConversation.id,
      message: `Task handed off from ${fromAgent} to ${toAgent}`
    });

  } catch (error) {
    console.error('Handoff error:', error);
    return NextResponse.json({ error: 'Handoff failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const supabase = createRouteHandlerClient();

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    // Get handoffs for this conversation
    const { data: handoffs, error } = await supabase
      .from('agent_handoffs')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching handoffs:', error);
      return NextResponse.json({ error: 'Failed to fetch handoffs' }, { status: 500 });
    }

    return NextResponse.json({ handoffs });

  } catch (error) {
    console.error('Error fetching handoffs:', error);
    return NextResponse.json({ error: 'Failed to fetch handoffs' }, { status: 500 });
  }
} 