
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { CreateRoomDialog } from "./CreateRoomDialog";
import { JoinRoomDialog } from "./JoinRoomDialog";
import { ChatRoom } from "./ChatRoom";

interface Room {
  id: string;
  name: string;
  code: string;
}

export const ChatRoomsList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      loadRooms();

      // Subscribe to room changes
      const channel = supabase
        .channel("room_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "chat_rooms",
          },
          () => {
            loadRooms();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const loadRooms = async () => {
    if (!session?.user) return;

    try {
      // First get rooms user created or is a member of
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("id, name, code")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading rooms:", error);
        return;
      }

      setRooms(data || []);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to use chat rooms</p>
      </div>
    );
  }

  if (selectedRoom) {
    return (
      <ChatRoom
        roomId={selectedRoom.id}
        roomName={selectedRoom.name}
        roomCode={selectedRoom.code}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <CreateRoomDialog />
        <JoinRoomDialog />
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="w-full p-4 text-left rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-medium">{room.name}</h3>
              <p className="text-sm text-muted-foreground">Code: {room.code}</p>
            </button>
          ))}
          {rooms.length === 0 && (
            <p className="text-center text-muted-foreground">
              No rooms yet. Create or join one!
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
