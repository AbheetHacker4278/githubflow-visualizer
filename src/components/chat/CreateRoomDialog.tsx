
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
import { Label } from "@/components/ui/label";

export const CreateRoomDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [maxSize, setMaxSize] = useState("10");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a room",
        variant: "destructive",
      });
      return;
    }

    // Validate max size
    const parsedMaxSize = parseInt(maxSize);
    if (isNaN(parsedMaxSize) || parsedMaxSize <= 0) {
      toast({
        title: "Invalid room size",
        description: "Room size must be a positive number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create the room first
      const { data: room, error: roomError } = await supabase
        .from("chat_rooms")
        .insert({
          name: roomName,
          created_by: session.user.id,
          max_size: parsedMaxSize,
          password: password || null,
          code: Math.random().toString(36).substring(2, 8).toUpperCase(), // Generate a simple code
        })
        .select()
        .single();

      if (roomError) {
        console.error("Error creating room:", roomError);
        throw new Error(roomError.message);
      }

      if (!room) {
        throw new Error("Room creation failed");
      }

      // Add creator as member
      const { error: memberError } = await supabase
        .from("room_members")
        .insert({
          room_id: room.id,
          user_id: session.user.id,
        });

      if (memberError) {
        console.error("Error adding member:", memberError);
        // Clean up the created room
        await supabase.from("chat_rooms").delete().eq("id", room.id);
        throw new Error(memberError.message);
      }

      toast({
        title: "Room created!",
        description: `Room code: ${room.code}`,
      });

      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Room creation error:", error);
      toast({
        title: "Error creating room",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRoomName("");
    setMaxSize("10");
    setPassword("");
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
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxSize">Maximum Room Size</Label>
            <Input
              id="maxSize"
              type="number"
              min="1"
              placeholder="Maximum number of members"
              value={maxSize}
              onChange={(e) => setMaxSize(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password (Optional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Room password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
