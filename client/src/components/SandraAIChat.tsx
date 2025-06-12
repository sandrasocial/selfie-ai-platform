import React, { useState, useRef, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Sparkles, User, Crown } from 'lucide-react';
import { ProfileCompletionPrompt } from '@/components/ProfileCompletionPrompt';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function SandraAIChat() {
  const { profile, hasProfile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: hasProfile 
        ? `Hello gorgeous! I can see you're working in ${profile?.industry || 'your industry'} with a ${profile?.toneVoice?.toLowerCase() || 'unique'} brand voice. I'm here to help you build your empire. What's on your mind today?`
        : "Hello beautiful! I'm Sandra, your luxury brand strategist. I help ambitious women build their personal brand empires. How can I elevate your brand today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Base Sandra AI prompt
      let basePrompt = `You are Sandra, a luxury brand strategist and business coach helping ambitious women build their personal brand empires. 
      
      Respond in a confident, empowering, and sophisticated tone with practical, actionable advice. 
      You're the mentor they wish they had - direct but supportive, luxury-minded but accessible.
      
      Keep responses conversational but valuable. Include specific next steps when appropriate.
      
      User message: "${userMessage}"`;

      // Add profile personalization if available
      if (hasProfile && profile) {
        basePrompt += `

PERSONALIZATION CONTEXT:
- Their Brand Mission: ${profile.brandMission || 'Building an authentic brand'}
- Target Audience: ${profile.idealAudience || 'Professional women'}
- Brand Values: ${profile.brandValues || 'Authenticity and empowerment'}
- Industry: ${profile.industry || 'Business'}
- Experience Level: ${profile.experienceLevel || 'Growing'}
- Current Goals: ${profile.mainGoals || 'Building their brand'}
- Visual Aesthetic: ${profile.visualAesthetic || 'Professional'}
- Tone Preference: ${profile.toneVoice || 'Confident'}

Tailor your advice specifically to their profile, reference their goals and industry when relevant, and speak in a way that resonates with their brand voice preference.`;
      }

      const response = await fetch('/api/ai/sandra-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: basePrompt,
          hasProfile: hasProfile,
          userId: profile?.userId || 'anonymous'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const sandraMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || "I'm here to help you build your brand empire. What specific challenge can I help you tackle today?",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, sandraMsg]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having a moment of technical difficulty, but I'm still here for you! Try again in just a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };



  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-black text-white font-bold">S</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl" style={{ fontFamily: 'Cormorant Garamond' }}>Sandra AI</span>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {hasProfile ? 'Personalized' : 'General'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {hasProfile 
                  ? `Your ${profile?.visualAesthetic?.toLowerCase() || 'luxury'} brand strategist`
                  : 'Luxury Brand Strategist & Business Coach'
                }
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {!hasProfile && <ProfileCompletionPrompt />}
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.isUser
                      ? 'bg-black text-white'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!message.isUser && (
                      <Crown className="h-4 w-4 mt-0.5 text-black" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.isUser ? 'text-gray-200' : 'text-muted-foreground'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-black" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={hasProfile 
                  ? `Ask Sandra about ${profile?.industry?.toLowerCase() || 'your business'}...`
                  : "Ask Sandra about building your brand empire..."
                }
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}