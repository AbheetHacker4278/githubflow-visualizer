
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

export const JoinRoomDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setIsLoading(true);
    try {
      // Find room by code
      const { data: room, error: roomError } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("code", roomCode.toUpperCase())
        .single();

      if (roomError) throw new Error("Room not found");

      // Join room
      const { error: joinError } = await supabase.from("room_members").insert({
        room_id: room.id,
        user_id: session.user.id,
      });

      if (joinError) {
        if (joinError.code === "23505") {
          // Unique violation - already a member
          toast({
            title: "Already joined",
            description: "You are already a member of this room",
          });
        } else {
          throw joinError;
        }
      } else {
        toast({
          title: "Success!",
          description: "You have joined the room",
        });
      }

      setIsOpen(false);
      setRoomCode("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join room",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Join Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Chat Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleJoinRoom} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              required
              maxLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
