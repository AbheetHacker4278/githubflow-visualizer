
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export const CreateRoomDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setIsLoading(true);
    try {
      // Insert the room
      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .insert({
          name: roomName,
          code: await generateRoomCode(),
          created_by: session.user.id,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add creator as member
      const { error: memberError } = await supabase
        .from("room_members")
        .insert({
          room_id: roomData.id,
          user_id: session.user.id,
        });

      if (memberError) throw memberError;

      toast({
        title: "Room created!",
        description: `Room code: ${roomData.code}`,
      });
      setIsOpen(false);
      setRoomName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoomCode = async (): Promise<string> => {
    const { data, error } = await supabase.rpc("generate_room_code");
    if (error) throw error;
    return data;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Chat Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateRoom} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
