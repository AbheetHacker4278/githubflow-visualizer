import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  repoUrl?: string;
  botName?: string;
}

const AnimatedLogo = () => (
  <div className="relative w-6 h-6 animate-pulse">
    <svg
      viewBox="0 0 24 24"
      className="w-full h-full fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="animate-dash"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"
        style={{
          strokeDasharray: 56,
          strokeDashoffset: 56,
          animation: "dash 1.5s ease-in-out infinite"
        }}
      />
      <path
        className="animate-bubble"
        d="M8 12h8M12 16V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          animation: "bubble 1s ease-in-out infinite"
        }}
      />
    </svg>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-2 bg-secondary rounded-2xl max-w-[80%]">
    <span className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
    <span className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
    <span className="w-2 h-2 bg-secondary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
  </div>
);

// Add these styles to your global CSS or keep them inline
const styles = `
  @keyframes dash {
    0% {
      stroke-dashoffset: 56;
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -56;
    }
  }
  
  @keyframes bubble {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0.95);
      opacity: 0.8;
    }
  }
  
  .gradient-bg {
    background: linear-gradient(120deg, #4f46e5, #06b6d4);
  }
  
  .logo-shadow {
    filter: drop-shadow(0 0 8px rgba(79, 70, 229, 0.45));
  }
`;

const ChatBot = ({ repoUrl, botName = "GitViz Assistant" }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, input]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      role: "user" as const, 
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: input,
          repoUrl,
          context: messages.slice(-5)
        }
      });

      if (error) throw error;
      
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response from chatbot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <style>{styles}</style>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg gradient-bg hover:scale-105 transition-all duration-300 logo-shadow"
        >
          <div className="text-white">
            <AnimatedLogo />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent 
        className="w-[400px] sm:w-[540px] p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        side="right"
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-3">
            <Avatar className="h-8 w-8 gradient-bg">
              <AnimatedLogo />
            </Avatar>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600 font-semibold">
              {botName}
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100vh-8rem)] flex-col">
          <ScrollArea 
            className="flex-1 px-4"
            ref={scrollAreaRef}
          >
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 gap-2">
                  <AnimatedLogo />
                  <p className="text-center text-sm text-muted-foreground">
                    Ask me anything about GitViz or your repository!
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        message.role === "assistant" ? "items-start" : "items-end"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                          message.role === "assistant"
                            ? "bg-secondary text-secondary-foreground"
                            : "gradient-bg text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex flex-col items-start">
                      <TypingIndicator />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background/95">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                disabled={isLoading}
                className="rounded-full"
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading}
                size="icon"
                className="rounded-full gradient-bg hover:opacity-90"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Send className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;