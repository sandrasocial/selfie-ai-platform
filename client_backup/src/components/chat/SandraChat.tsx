
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  category?: string;
}

interface SandraChatProps {
  user?: any;
}

export default function SandraChat({ user }: SandraChatProps) {
  // Load persistent conversation history from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem(`sandra_chat_${user?.id || 'guest'}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Only show greeting if no previous conversation exists
        if (parsed.length > 0) {
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        localStorage.removeItem(`sandra_chat_${user?.id || 'guest'}`);
      }
    }
    
    // Show greeting only for new conversations
    return [
      {
        id: '1',
        message: "Hey gorgeous! I'm so glad you're here. Think of me as your personal hype woman and life coach rolled into one. Whether you need help with confidence, business moves, relationships, or just want to chat about life - I'm here for you.\n\nWhat's on your heart today?",
        isUser: false,
        timestamp: new Date(),
      }
    ];
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const topics = [
    { value: 'confidence', label: 'Confidence & Self-Worth' },
    { value: 'business', label: 'Business & Career' },
    { value: 'relationships', label: 'Love & Relationships' },
    { value: 'mindset', label: 'Mindset & Growth' },
    { value: 'beauty', label: 'Beauty & Style' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'motherhood', label: 'Motherhood' },
    { value: 'divorce', label: 'Divorce & Healing' },
  ];

  const quickPrompts = [
    "I'm struggling with confidence lately...",
    "How do I start my own business?",
    "I'm going through a tough breakup",
    "I want to reinvent myself",
    "I feel stuck in life",
    "How do I build my personal brand?",
  ];

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; category?: string; conversationHistory: ChatMessage[] }) => {
      const response = await fetch("/api/chat-sandra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Sandra");
      }

      return response.json();
    },
    onSuccess: (data) => {
      const sandraResponse: ChatMessage = {
        id: Date.now().toString(),
        message: data.response || "I'm here for you, but I had trouble responding just now. Can you try asking again?",
        isUser: false,
        timestamp: new Date(),
        category: data.category,
      };
      setMessages(prev => {
        const newMessages = [...prev, sandraResponse];
        // Save to localStorage for persistent memory
        localStorage.setItem(`sandra_chat_${user?.id || 'guest'}`, JSON.stringify(newMessages));
        return newMessages;
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Issue",
        description: "Sandra had trouble responding. Try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Save to localStorage for persistent memory
      localStorage.setItem(`sandra_chat_${user?.id || 'guest'}`, JSON.stringify(newMessages));
      return newMessages;
    });
    
    chatMutation.mutate({
      message: currentMessage,
      category: selectedTopic || undefined,
      conversationHistory: [...messages, userMessage].slice(-5), // Send last 5 messages for context
    });

    setCurrentMessage('');
    setSelectedTopic('');
  };

  const useQuickPrompt = (prompt: string) => {
    setCurrentMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="space-y-6">
      <Card className="border border-[#171719] shadow-none" style={{ backgroundColor: '#F1F1F1' }}>
        <CardHeader className="border-b border-[#B5B5B3] pb-6">
          <CardTitle 
            className="text-[#171719] text-[24px] font-normal mb-2"
            className="font-cormorant"
          >
            Sandra — AI Chat Mentor
          </CardTitle>
          <p 
            className="text-[#4C4B4B] text-[14px] leading-relaxed"
            className="font-neue"
          >
            Empowering guidance, whenever you need it most.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Topic Selection */}
          <div className="space-y-4">
            <p 
              className="text-[14px] font-medium text-[#171719]"
              className="font-neue"
            >
              What would you like to talk about?
            </p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Button
                  key={topic.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTopic(selectedTopic === topic.value ? '' : topic.value)}
                  className={`
                    text-[12px] border border-white bg-transparent text-white h-8 px-3
                    hover:bg-white hover:text-black hover:shadow-sm
                    transition-all duration-200
                    ${selectedTopic === topic.value ? 'bg-white text-black' : ''}
                  `}
                  style={{ 
                    fontFamily: 'Neue Einstellung, sans-serif',
                    backgroundColor: selectedTopic === topic.value ? 'white' : '#171719',
                    color: selectedTopic === topic.value ? '#171719' : 'white',
                    borderRadius: '0px'
                  }}
                >
                  {topic.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            className="border border-[#B5B5B3] p-6 h-96 overflow-y-auto space-y-4"
            style={{ backgroundColor: '#F1F1F1', borderRadius: '0px' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                style={{ marginBottom: '16px' }}
              >
                <div 
                  className={`max-w-[80%] p-4 border ${
                    message.isUser 
                      ? 'bg-white text-[#171719] border-none' 
                      : 'text-white border-[#B5B5B3]'
                  }`}
                  style={{
                    backgroundColor: message.isUser ? 'white' : '#171719',
                    fontFamily: message.isUser ? 'Neue Einstellung, sans-serif' : 'Cormorant Garamond, serif',
                    fontSize: message.isUser ? '14px' : '16px',
                    lineHeight: '1.5',
                    borderRadius: '0px'
                  }}
                >
                  <p className="whitespace-pre-line">{message.message}</p>
                  <span 
                    className="text-[12px] opacity-60 mt-2 block text-right"
                    className="font-neue"
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start" style={{ marginBottom: '16px' }}>
                <div 
                  className="border border-[#B5B5B3] p-4 text-white"
                  style={{ 
                    backgroundColor: '#171719',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '16px',
                    borderRadius: '0px'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white animate-bounce" style={{ borderRadius: '50%' }}></div>
                      <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: '0.1s', borderRadius: '50%' }}></div>
                      <div className="w-2 h-2 bg-white animate-bounce" style={{ animationDelay: '0.2s', borderRadius: '50%' }}></div>
                    </div>
                    <span className="text-sm italic">Sandra is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="space-y-4">
            <p 
              className="text-[14px] font-medium text-[#4C4B4B]"
              className="font-neue"
            >
              Need inspiration? Try these:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => useQuickPrompt(prompt)}
                  className="text-[12px] border border-[#B5B5B3] bg-transparent text-[#4C4B4B] hover:bg-[#4C4B4B] hover:text-white hover:shadow-sm transition-all duration-200 h-auto py-2 px-3"
                  style={{ 
                    fontFamily: 'Neue Einstellung, sans-serif',
                    borderRadius: '0px'
                  }}
                >
                  "{prompt}"
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-4 border-t border-[#B5B5B3] pt-6">
            <Textarea
              placeholder="Share what's on your heart... Sandra's here to listen and guide you"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={3}
              className="bg-white text-[#171719] border border-[#171719] resize-none"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                fontSize: '14px',
                borderRadius: '0px'
              }}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!currentMessage.trim() || chatMutation.isPending}
              className="w-full bg-transparent border border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white hover:shadow-sm transition-all duration-200 h-12"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: '0px'
              }}
            >
              {chatMutation.isPending ? "Sandra is responding..." : "Send to Sandra"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Stats */}
      <Card 
        className="border border-[#B5B5B3] shadow-none"
        style={{ backgroundColor: '#F1F1F1', borderRadius: '0px' }}
      >
        <CardContent className="pt-6">
          <div 
            className="flex items-center justify-between text-[14px] text-[#4C4B4B]"
            className="font-neue"
          >
            <span>Messages today: {messages.filter(m => m.isUser).length}</span>
            <span>Sandra is here for you 24/7</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
