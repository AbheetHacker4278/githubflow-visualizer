import { useState } from "react";
import { UserRound, LogOut, Home, UserPlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-github-darker/50"
          >
            <UserRound className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          {session ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 mb-2"
                onClick={() => {
                  setOpen(false);
                  navigate("/auth");
                }}
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setOpen(false);
                  navigate("/");
                }}
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};