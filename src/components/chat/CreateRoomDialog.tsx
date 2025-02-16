
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
    if (!session?.user) return;

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
      // Insert the room
      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .insert({
          name: roomName,
          code: await generateRoomCode(),
          created_by: session.user.id,
          max_size: parsedMaxSize,
          password: password || null, // Store null if no password is provided
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
      resetForm();
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
