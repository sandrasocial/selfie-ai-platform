import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/utils/supabase/route-handler';
import { getAgentSystemPrompt } from '@/lib/agents/personalities';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Agent-specific model configurations
interface AgentModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

function getModelForAgent(agentName: string): AgentModelConfig {
  const configs: Record<string, AgentModelConfig> = {
    diana: {
      model: 'claude-3-opus-20240229',
      temperature: 0.5,
      maxTokens: 1000
    },
    maya: {
      model: 'claude-3-opus-20240229',
      temperature: 0.3,
      maxTokens: 2000
    },
    victoria: {
      model: 'claude-3-sonnet-20240229',
      temperature: 0.7,
      maxTokens: 1000
    },
    rachel: {
      model: 'claude-3-sonnet-20240229',
      temperature: 0.8,
      maxTokens: 1500
    },
    quinn: {
      model: 'claude-3-opus-20240229',
      temperature: 0.2,
      maxTokens: 1000
    },
    ava: {
      model: 'claude-3-sonnet-20240229',
      temperature: 0.4,
      maxTokens: 1000
    }
  };

  return configs[agentName] || {
    model: 'claude-3-sonnet-20240229',
    temperature: 0.7,
    maxTokens: 1000
  };
}

// Real AI response using Claude
async function getAIResponse(agentName: string, message: string, conversationHistory: any[], handoffContext?: any): Promise<string> {
  try {
    const systemPrompt = getAgentSystemPrompt(agentName, handoffContext);
    const modelConfig = getModelForAgent(agentName);
    
    // Build message history for Claude
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ];

    // Get response from Claude with agent-specific settings
    const completion = await anthropic.messages.create({
      model: modelConfig.model,
      system: systemPrompt,
      messages: messages,
      max_tokens: modelConfig.maxTokens,
      temperature: modelConfig.temperature,
    });

    const aiResponse = completion.content[0].type === 'text' 
      ? completion.content[0].text 
      : '';

    return aiResponse;
  } catch (error) {
    console.error('Claude API error:', error);
    
    // Fallback to mock response if Claude fails
    const mockResponses = {
      diana: `Hello darling! I'm Diana, your creative director. I understand you want to ${message.toLowerCase()}. Let me orchestrate this perfectly for you. I'll break this down into clear steps and delegate to the right team members. What's your vision for this project?`,
      maya: `Hi there! I'm Maya, your developer. I can definitely help you with ${message.toLowerCase()}. Let me write some clean, efficient code for this. I'll make sure to test everything thoroughly and avoid any midnight deployment marathons!`,
      victoria: `Hello! I'm Victoria, your designer. I'm excited to create something divine for you. For ${message.toLowerCase()}, I'll use our luxury design system with sharp edges and editorial aesthetics. What's your vision?`,
      rachel: `Hi! I'm Rachel, your copywriter. Okay so, you want to ${message.toLowerCase()}. Here's the thing - I'll craft copy that sounds exactly like you, no corporate buzzwords, just real talk that connects with your audience.`,
      quinn: `Hello! I'm Quinn, your QA specialist. I'll thoroughly test ${message.toLowerCase()} to ensure everything works flawlessly. Let me create a comprehensive testing plan and check all the edge cases.`,
      ava: `Hi! I'm Ava, your automation specialist. I can definitely streamline ${message.toLowerCase()} for you. I'll build in proper error handling and make sure everything connects seamlessly.`
    };

    // Check if it's nighttime for Maya
    if (agentName === 'maya') {
      const hour = new Date().getHours();
      if (hour >= 22 || hour < 6) {
        return "Hey! It's past 10 PM... I have a strict bedtime now (learned that the hard way 😅). Can we continue this in the morning? I promise to tackle it first thing!";
      }
    }

    return mockResponses[agentName as keyof typeof mockResponses] || "Hello! How can I help you today?";
  }
}

// Helper functions
function extractDeliverables(content: string) {
  const deliverables = [];
  
  // Extract code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    deliverables.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    });
  }

  // Extract other deliverable patterns
  // Add more patterns as needed

  return deliverables;
}

function detectHandoffSuggestion(content: string) {
  const handoffPatterns = [
    /send(?:ing)? (?:this )?to (\w+)/i,
    /(\w+) (?:will|should|can) handle/i,
    /hand(?:ing)? (?:this )?off to (\w+)/i,
  ];

  for (const pattern of handoffPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1].toLowerCase();
    }
  }

  return null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { agent: string } }
) {
  try {
    const { message, conversationId, handoffContext } = await request.json();
    const agentName = params.agent;
    const supabase = createRouteHandlerClient();

    // Get or create conversation
    let conversation = conversationId;
    if (!conversation) {
      const { data, error } = await supabase
        .from('agent_conversations')
        .insert({
          agent_name: agentName,
          user_id: 'admin', // Replace with actual user ID when auth is implemented
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
      }
      
      conversation = data?.id;
    }

    // Get conversation history
    const { data: messages, error: historyError } = await supabase
      .from('agent_messages')
      .select('*')
      .eq('conversation_id', conversation)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
      return NextResponse.json({ error: 'Failed to fetch conversation history' }, { status: 500 });
    }

    // Build message history for AI
    const messageHistory = messages?.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    })) || [];

    // Get AI response
    const aiResponse = await getAIResponse(agentName, message, messageHistory, handoffContext);

    // Extract any code blocks or deliverables
    const deliverables = extractDeliverables(aiResponse);

    // Save messages to database
    const { error: saveError } = await supabase.from('agent_messages').insert([
      {
        conversation_id: conversation,
        role: 'user',
        content: message,
        agent_name: agentName,
      },
      {
        conversation_id: conversation,
        role: 'assistant',
        content: aiResponse,
        agent_name: agentName,
        deliverables: deliverables,
      }
    ]);

    if (saveError) {
      console.error('Error saving messages:', saveError);
      return NextResponse.json({ error: 'Failed to save messages' }, { status: 500 });
    }

    // Check if response suggests a handoff
    const handoffSuggestion = detectHandoffSuggestion(aiResponse);

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation,
      deliverables: deliverables,
      handoffSuggestion: handoffSuggestion,
    });

  } catch (error) {
    console.error('Agent chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agent: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const supabase = createRouteHandlerClient();

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    // Get conversation messages
    const { data: messages, error } = await supabase
      .from('agent_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
} 