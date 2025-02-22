
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, ChatRoom } from "@/types/chat";
import { toast } from "sonner";

export default function ChatRoomDetail() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !id) {
      navigate("/chat");
      return;
    }

    fetchRoomDetails();
    fetchMessages();
    subscribeToMessages();
  }, [session, id]);

  const fetchRoomDetails = async () => {
    try {
      const { data: room, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setRoom(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Failed to load chat room");
      navigate("/chat");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("room_messages")
        .select("*")
        .eq("room_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_messages", filter: `room_id=eq.${id}` },
        (payload) => {
          console.log("Message change received:", payload);
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!session?.user?.id || !newMessage.trim()) return;

    try {
      const { error } = await supabase.from("room_messages").insert({
        room_id: id,
        user_id: session.user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>Loading chat room...</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>Chat room not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col h-[80vh] rounded-lg border">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">{room.name}</h1>
          <p className="text-sm text-gray-500">Room Code: {room.code}</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user_id === session?.user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.user_id === session?.user?.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <span className="text-xs opacity-70">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
