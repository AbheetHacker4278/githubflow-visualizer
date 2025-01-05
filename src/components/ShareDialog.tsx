import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  currentState: {
    nodes: any[];
    edges: any[];
    zoom: number;
    position: [number, number];
  };
}

export function ShareDialog({ currentState }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");

  const generateShareableUrl = () => {
    const stateParam = encodeURIComponent(JSON.stringify(currentState));
    const baseUrl = window.location.origin + window.location.pathname;
    const shareableUrl = `${baseUrl}?state=${stateParam}${isPasswordProtected ? `&protected=true` : ''}`;
    return shareableUrl;
  };

  const handleCopyUrl = async () => {
    const url = generateShareableUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "URL Copied!",
        description: "The shareable URL has been copied to your clipboard.",
      });
      setIsOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share className="h-4 w-4" />
          Share View
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Visualization</DialogTitle>
          <DialogDescription>
            Create a shareable link to this exact view of your repository
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={generateShareableUrl()}
              readOnly
              className="flex-1"
            />
            <Button onClick={handleCopyUrl}>Copy</Button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="password-protect"
              checked={isPasswordProtected}
              onChange={(e) => setIsPasswordProtected(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="password-protect">Password protect</label>
          </div>
          {isPasswordProtected && (
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}