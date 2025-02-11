
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, Send, ImageIcon, X } from "lucide-react";

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  roomCode: string;
}

interface Message {
  id: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  user_id: string;
}

export const ChatRoom = ({ roomId, roomName, roomCode }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("room_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("room_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
      return;
    }

    setMessages(data);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!session?.user || (!newMessage && !selectedImage && !selectedVideo)) return;

    setIsLoading(true);
    try {
      let image_url = null;
      let video_url = null;

      // Upload image if selected
      if (selectedImage) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from("chat_media")
          .upload(`${Date.now()}_${selectedImage.name}`, selectedImage);

        if (imageError) throw imageError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("chat_media").getPublicUrl(imageData.path);
        image_url = publicUrl;
      }

      // Upload video if selected
      if (selectedVideo) {
        const { data: videoData, error: videoError } = await supabase.storage
          .from("chat_media")
          .upload(`${Date.now()}_${selectedVideo.name}`, selectedVideo);

        if (videoError) throw videoError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("chat_media").getPublicUrl(videoData.path);
        video_url = publicUrl;
      }

      // Send message
      const { error: messageError } = await supabase.from("room_messages").insert({
        room_id: roomId,
        user_id: session.user.id,
        content: newMessage || null,
        image_url,
        video_url,
      });

      if (messageError) throw messageError;

      setNewMessage("");
      setSelectedImage(null);
      setSelectedVideo(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Video size should be less than 100MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedVideo(file);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 py-2 border-b">
        <h2 className="text-lg font-semibold">{roomName}</h2>
        <p className="text-sm text-muted-foreground">Code: {roomCode}</p>
      </div>
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
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
                {message.content && <p className="break-words">{message.content}</p>}
                {message.image_url && (
                  <img
                    src={message.image_url}
                    alt="Shared image"
                    className="max-w-full rounded mt-2 cursor-pointer"
                    onClick={() => window.open(message.image_url, "_blank")}
                  />
                )}
                {message.video_url && (
                  <video
                    controls
                    className="max-w-full rounded mt-2"
                    src={message.video_url}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        {(selectedImage || selectedVideo) && (
          <div className="mb-2">
            {selectedImage && (
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="h-20 rounded object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
            {selectedVideo && (
              <div className="relative inline-block">
                <video
                  src={URL.createObjectURL(selectedVideo)}
                  className="h-20 rounded"
                />
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
            ref={fileInputRef}
          />
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoSelect}
            ref={videoInputRef}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
            type="button"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
