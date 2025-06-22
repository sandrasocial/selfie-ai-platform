'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, Copy, ArrowRight, User, Bot } from 'lucide-react';
import { AgentChatMessage } from '@/components/admin/AgentChatMessage';
import { AgentHandoffButtons } from '@/components/admin/AgentHandoffButtons';
import { TaskStatusTracker } from '@/components/admin/TaskStatusTracker';
import { getAgentGreeting } from '@/lib/agents/personalities';

// Agent definitions with personalities
const agents = {
  diana: {
    name: 'Diana',
    role: 'Director',
    description: 'Orchestrates projects, delegates tasks',
    avatar: '👑',
    color: 'bg-purple-100 text-purple-800',
    personality: 'Strategic, organized, and results-driven. Diana thinks big picture and ensures everything aligns with your goals.'
  },
  maya: {
    name: 'Maya',
    role: 'Developer',
    description: 'Writes code, builds features',
    avatar: '💻',
    color: 'bg-blue-100 text-blue-800',
    personality: 'Technical, detail-oriented, and solution-focused. Maya gets excited about clean code and elegant solutions.'
  },
  victoria: {
    name: 'Victoria',
    role: 'Designer',
    description: 'Creates beautiful designs',
    avatar: '🎨',
    color: 'bg-pink-100 text-pink-800',
    personality: 'Creative, aesthetic, and brand-conscious. Victoria sees beauty in everything and loves making things look amazing.'
  },
  rachel: {
    name: 'Rachel',
    role: 'Copywriter',
    description: 'Writes in your brand voice',
    avatar: '✍️',
    color: 'bg-green-100 text-green-800',
    personality: 'Expressive, brand-aware, and audience-focused. Rachel has a way with words and understands the power of storytelling.'
  },
  quinn: {
    name: 'Quinn',
    role: 'QA',
    description: 'Tests everything perfectly',
    avatar: '🔍',
    color: 'bg-orange-100 text-orange-800',
    personality: 'Meticulous, thorough, and quality-focused. Quinn has an eye for detail and won\'t let anything slip through the cracks.'
  },
  ava: {
    name: 'Ava',
    role: 'Automation',
    description: 'Connects systems',
    avatar: '⚡',
    color: 'bg-yellow-100 text-yellow-800',
    personality: 'Efficient, systematic, and integration-minded. Ava sees connections others miss and loves making things work automatically.'
  }
};

type Message = {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agent?: string;
  isCode?: boolean;
  isCopy?: boolean;
  deliverables?: any[];
};

export default function AgentChatPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agent as string;
  const agent = agents[agentId as keyof typeof agents];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [handoffContext, setHandoffContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with agent greeting
  useEffect(() => {
    if (agent && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        type: 'agent',
        content: getAgentGreeting(agentId),
        timestamp: new Date(),
        agent: agentId
      }]);
    }
  }, [agent, agentId, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/agent-chat/${agentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationId: conversationId,
          handoffContext: handoffContext
        })
      });

      const data = await response.json();

      if (response.ok) {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: data.response,
          timestamp: new Date(),
          agent: agentId,
          deliverables: data.deliverables
        };

        setMessages(prev => [...prev, agentMessage]);
        setConversationId(data.conversationId);

        // Handle handoff suggestions
        if (data.handoffSuggestion) {
          console.log('Handoff suggested to:', data.handoffSuggestion);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        agent: agentId
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: Add toast notification
      console.log('Copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sendToAgent = async (targetAgent: string) => {
    try {
      const response = await fetch('/api/admin/agent-handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAgent: agentId,
          toAgent: targetAgent,
          conversationId: conversationId,
          taskDescription: `Handoff from ${agent?.name} to ${agents[targetAgent as keyof typeof agents]?.name}`,
          deliverables: []
        })
      });

      const data = await response.json();

      if (response.ok) {
        const handoffMessage: Message = {
          id: Date.now().toString(),
          type: 'system',
          content: `Handing off to ${agents[targetAgent as keyof typeof agents]?.name}...`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, handoffMessage]);

        // Navigate to the new agent chat
        router.push(`/admin/agent-chat/${targetAgent}?conversation=${data.newConversationId}`);
      } else {
        throw new Error(data.error || 'Handoff failed');
      }
    } catch (error) {
      console.error('Error during handoff:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: 'Handoff failed. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const sendToDiana = async () => {
    try {
      const response = await fetch('/api/admin/agent-handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAgent: agentId,
          toAgent: 'diana',
          conversationId: conversationId,
          taskDescription: `Review request from ${agent?.name}`,
          deliverables: []
        })
      });

      const data = await response.json();

      if (response.ok) {
        const reviewMessage: Message = {
          id: Date.now().toString(),
          type: 'system',
          content: 'Sending to Diana for review...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, reviewMessage]);

        // Navigate to Diana's chat
        router.push(`/admin/agent-chat/diana?conversation=${data.newConversationId}`);
      } else {
        throw new Error(data.error || 'Review request failed');
      }
    } catch (error) {
      console.error('Error sending to Diana:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: 'Failed to send to Diana. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-soft-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bodoni text-luxury-black mb-4">Agent Not Found</h2>
          <p className="text-warm-gray">The agent you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-warm-gray/20 p-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${agent.color}`}>
            {agent.avatar}
          </div>
          <div>
            <h1 className="text-xl font-bodoni text-luxury-black">{agent.name}</h1>
            <p className="text-sm text-warm-gray">{agent.role} • {agent.description}</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <AgentChatMessage
              key={message.id}
              message={message}
              agent={agent}
              onCopy={copyToClipboard}
            />
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${agent.color}`}>
                {agent.avatar}
              </div>
              <div className="bg-white p-4 rounded-lg border border-warm-gray/20 flex-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-warm-gray rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-warm-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-warm-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Handoff Buttons */}
        <div className="p-4 border-t border-warm-gray/20">
          <AgentHandoffButtons
            currentAgent={agentId}
            agents={agents}
            onSendToAgent={sendToAgent}
            onSendToDiana={sendToDiana}
          />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-warm-gray/20">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${agent.name}...`}
                className="w-full p-3 pr-12 border border-warm-gray/20 rounded-lg focus:border-luxury-black outline-none resize-none"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 top-2 p-2 bg-luxury-black text-white rounded-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Status Tracker */}
      <div className="bg-white border-t border-warm-gray/20 p-4">
        <TaskStatusTracker agentId={agentId} />
      </div>
    </div>
  );
} 