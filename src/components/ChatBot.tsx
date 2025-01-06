import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBotProps {
  repoUrl?: string;
}

const ChatBot = ({ repoUrl }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Calling chat function with input:", input);
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: input,
          repoUrl,
          context: messages.slice(-5) // Send last 5 messages for context
        }
      });

      if (error) throw error;
      
      console.log("Chat response:", data);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>GitViz Assistant</SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 pt-4">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Ask me anything about GitViz or the repository you're visualizing!
                </p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "assistant"
                          ? "bg-secondary"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading}>
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;