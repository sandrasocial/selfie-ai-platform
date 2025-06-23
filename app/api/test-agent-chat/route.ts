// Simple test auth bypass for agent chat testing
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getAgentSystemPrompt } from '@/lib/agents/personalities';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('Testing agent chat API...');
    
    const body = await request.json();
    const { agent = 'rachel', message } = body;
    
    console.log('Test request:', { agent, message });

    // Validate agent parameter - Maya permanently removed for security
    const validAgents = ['diana', 'victoria', 'rachel', 'quinn', 'ava'];
    if (!validAgents.includes(agent)) {
      return NextResponse.json({ error: 'Invalid agent' }, { status: 400 });
    }

    // Get agent system prompt
    const systemPrompt = getAgentSystemPrompt(agent);
    
    // Simple test response using Claude
    try {
      const completion = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        system: systemPrompt,
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const aiResponse = completion.content[0].type === 'text' 
        ? completion.content[0].text 
        : 'Hello! I received your message.';

      return NextResponse.json({
        success: true,
        response: aiResponse,
        agent: agent,
        test: true
      });
    } catch (claudeError) {
      console.error('Claude API error:', claudeError);
      
      // Fallback response
      const fallbackResponses = {
        diana: `Hello! I'm Diana, your creative director. I understand you want to ${message.toLowerCase()}. Let me orchestrate this perfectly for you!`,
        victoria: `Hello! I'm Victoria, your designer. I'm excited to create something beautiful for ${message.toLowerCase()}!`,
        rachel: `Hi! I'm Rachel, your copywriter. I'll craft amazing copy for ${message.toLowerCase()} that really connects with your audience!`,
        quinn: `Hello! I'm Quinn, your QA specialist. I'll thoroughly test ${message.toLowerCase()} to ensure everything works perfectly!`,
        ava: `Hi! I'm Ava, your automation specialist. I can streamline ${message.toLowerCase()} and make everything work seamlessly!`
      };

      return NextResponse.json({
        success: true,
        response: fallbackResponses[agent as keyof typeof fallbackResponses] || "Hello! How can I help you today?",
        agent: agent,
        test: true,
        fallback: true
      });
    }

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      error: 'Test API error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
