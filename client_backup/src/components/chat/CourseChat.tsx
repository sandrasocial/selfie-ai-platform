
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

interface CourseChatProps {
  onClose: () => void;
}

export default function CourseChat({ onClose }: CourseChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hey gorgeous! Welcome to The Viral SELFIE Blueprint! I'm Sandra, and I'm here to help you master every framework and strategy in this course. Whether you're stuck on a concept, need clarification on an exercise, or want personalized advice on implementing what you're learning - just ask! What can I help you with today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/course-chat", {
        message: currentMessage,
        context: "viral_selfie_blueprint_course"
      });

      if (response.ok) {
        const data = await response.json();
        const sandraResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, sandraResponse]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I'm having a little technical hiccup right now, but don't worry! Try asking me again in a moment, or if you're really stuck, you can reach out to our support team. I'll be back to help you master these frameworks soon!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#171719]/90 flex items-center justify-center z-50 p-6">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col bg-[#F1F1F1] border border-[#B5B5B3]">
        <CardHeader className="flex-shrink-0 border-b border-[#B5B5B3] p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[20px] font-normal text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
              Sandra — Your AI Brand Coach
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#4C4B4B] hover:text-black"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-none text-sm tracking-wide leading-relaxed ${
                    msg.isUser
                      ? 'bg-[#171719] text-white'
                      : 'bg-[#F1F1F1] border border-[#B5B5B3] text-[#171719]'
                  }`}
                  style={{ fontFamily: 'Neue Einstellung' }}
                >
                  <p>{msg.message}</p>
                  <span className="text-[12px] opacity-60 mt-2 block text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#F1F1F1] border border-[#B5B5B3] p-3 text-sm rounded-none text-[#171719]">
                  <p style={{ fontFamily: 'Neue Einstellung' }}>Sandra is typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[#B5B5B3] pt-4 mt-4">
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about this course..."
                disabled={isLoading}
                className="flex-1 border-[#171719] rounded-none px-4 py-3 text-sm"
                style={{ fontFamily: 'Neue Einstellung' }}
              />
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isLoading}
                className="text-[#171719] border border-[#171719] bg-transparent hover:bg-[#171719] hover:text-white rounded-none px-6 py-3 text-sm uppercase tracking-wider"
                style={{ fontFamily: 'Neue Einstellung' }}
              >
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
