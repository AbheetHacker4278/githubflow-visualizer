
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { ChatRoom } from "@/types/chat";
import { toast } from "sonner";

export default function ChatRoomPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomPassword, setNewRoomPassword] = useState("");
  const [maxSize, setMaxSize] = useState(10);
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchRooms();
    subscribeToRooms();
  }, [session]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load chat rooms");
    }
  };

  const subscribeToRooms = () => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_rooms" },
        (payload) => {
          console.log("Room change received:", payload);
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createRoom = async () => {
    if (!session?.user?.id) return;

    try {
      const { data: roomCode } = await supabase.rpc("generate_room_code");
      
      const { data, error } = await supabase
        .from("chat_rooms")
        .insert({
          name: newRoomName,
          code: roomCode,
          created_by: session.user.id,
          max_size: maxSize,
          password: newRoomPassword || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Join the room automatically as creator
      await supabase.from("room_members").insert({
        room_id: data.id,
        user_id: session.user.id,
      });

      toast.success("Room created successfully!");
      navigate(`/chat/${data.id}`);
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    }
  };

  const joinRoom = async (room: ChatRoom) => {
    if (!session?.user?.id) return;

    try {
      const { data: members } = await supabase
        .from("room_members")
        .select("*")
        .eq("room_id", room.id);

      if (members && members.length >= room.max_size) {
        toast.error("Room is full");
        return;
      }

      const { error } = await supabase
        .from("room_members")
        .insert({
          room_id: room.id,
          user_id: session.user.id,
        });

      if (error) throw error;

      navigate(`/chat/${room.id}`);
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("Failed to join room");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Chat Rooms</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Create Room</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create a New Chat Room</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password (optional)"
                value={newRoomPassword}
                onChange={(e) => setNewRoomPassword(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max Size"
                value={maxSize}
                onChange={(e) => setMaxSize(parseInt(e.target.value))}
                min={2}
                max={50}
              />
              <Button onClick={createRoom} disabled={!newRoomName}>
                Create Room
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {rooms.length === 0 ? (
        <Alert>
          <AlertDescription>
            No chat rooms available. Create one to get started!
          </AlertDescription>
        </Alert>
      ) : (
        <ScrollArea className="h-[600px] rounded-md border p-4">
          <div className="grid gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{room.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created {new Date(room.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button onClick={() => joinRoom(room)}>
                  {room.password ? "Join (Requires Password)" : "Join"}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
