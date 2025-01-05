import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

const ShareDialog = ({ currentState }: ShareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const generateViewOnlyLink = () => {
    const stateParam = encodeURIComponent(JSON.stringify(currentState));
    const viewOnlyUrl = `${window.location.origin}/app?view=${stateParam}&readonly=true`;
    return viewOnlyUrl;
  };

  const copyToClipboard = async () => {
    const link = generateViewOnlyLink();
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "View-only link has been copied to your clipboard.",
      });
      setIsOpen(false);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
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
          <DialogTitle>Share View-Only Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this link to allow others to view the current state of your Git visualization.
            They won't be able to make any changes.
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={generateViewOnlyLink()}
              className="font-mono text-sm"
            />
            <Button onClick={copyToClipboard}>
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;