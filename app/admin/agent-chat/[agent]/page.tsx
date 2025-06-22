'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Send, Copy, ArrowRight, User, Bot } from 'lucide-react';
import { AgentChatMessage } from '@/components/admin/AgentChatMessage';
import { AgentHandoffButtons } from '@/components/admin/AgentHandoffButtons';
import { TaskStatusTracker } from '@/components/admin/TaskStatusTracker';

// Agent definitions with personalities
const agents = {
  diana: {
    name: 'Diana',
    role: 'Director',
    description: 'Orchestrates projects, delegates tasks',
    greeting: "Hello! I'm Diana, your project director. I'm here to help orchestrate your vision and delegate tasks to the right team members. What would you like to accomplish today?",
    avatar: '👑',
    color: 'bg-purple-100 text-purple-800',
    personality: 'Strategic, organized, and results-driven. Diana thinks big picture and ensures everything aligns with your goals.'
  },
  maya: {
    name: 'Maya',
    role: 'Developer',
    description: 'Writes code, builds features',
    greeting: "Hi there! I'm Maya, your developer. I love turning ideas into working code and building features that make a difference. What would you like me to build for you?",
    avatar: '💻',
    color: 'bg-blue-100 text-blue-800',
    personality: 'Technical, detail-oriented, and solution-focused. Maya gets excited about clean code and elegant solutions.'
  },
  victoria: {
    name: 'Victoria',
    role: 'Designer',
    description: 'Creates beautiful designs',
    greeting: "Hello! I'm Victoria, your designer. I'm passionate about creating beautiful, functional designs that capture your brand's essence. What visual magic can I create for you today?",
    avatar: '🎨',
    color: 'bg-pink-100 text-pink-800',
    personality: 'Creative, aesthetic, and brand-conscious. Victoria sees beauty in everything and loves making things look amazing.'
  },
  rachel: {
    name: 'Rachel',
    role: 'Copywriter',
    description: 'Writes in your brand voice',
    greeting: "Hi! I'm Rachel, your copywriter. I craft words that connect with your audience and stay true to your brand voice. What story would you like me to tell today?",
    avatar: '✍️',
    color: 'bg-green-100 text-green-800',
    personality: 'Expressive, brand-aware, and audience-focused. Rachel has a way with words and understands the power of storytelling.'
  },
  quinn: {
    name: 'Quinn',
    role: 'QA',
    description: 'Tests everything perfectly',
    greeting: "Hello! I'm Quinn, your QA specialist. I'm here to ensure everything works flawlessly and meets the highest standards. What would you like me to test or review?",
    avatar: '🔍',
    color: 'bg-orange-100 text-orange-800',
    personality: 'Meticulous, thorough, and quality-focused. Quinn has an eye for detail and won\'t let anything slip through the cracks.'
  },
  ava: {
    name: 'Ava',
    role: 'Automation',
    description: 'Connects systems',
    greeting: "Hi! I'm Ava, your automation specialist. I love connecting systems and making everything work seamlessly together. What processes can I streamline for you?",
    avatar: '⚡',
    color: 'bg-yellow-100 text-yellow-800',
    personality: 'Efficient, systematic, and integration-minded. Ava sees connections others miss and loves making things work automatically.'
  }
};

type Message = {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agent?: string;
  isCode?: boolean;
  isCopy?: boolean;
};

export default function AgentChatPage() {
  const params = useParams();
  const agentId = params.agent as string;
  const agent = agents[agentId as keyof typeof agents];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with agent greeting
  useEffect(() => {
    if (agent && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        type: 'agent',
        content: agent.greeting,
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

    // TODO: Add AI response logic here
    // For now, simulate a response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: `Thanks for your message! I'm ${agent.name} and I'm here to help with ${agent.role.toLowerCase()} tasks. This is a placeholder response - AI integration coming soon!`,
        timestamp: new Date(),
        agent: agentId
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1000);
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
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sendToAgent = (targetAgent: string) => {
    const handoffMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Handing off to ${agents[targetAgent as keyof typeof agents].name}...`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, handoffMessage]);
    // TODO: Implement actual handoff logic
  };

  const sendToDiana = () => {
    const reviewMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Sending to Diana for review...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, reviewMessage]);
    // TODO: Implement review handoff logic
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