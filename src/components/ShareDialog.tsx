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
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  repoUrl: string;
}

const ShareDialog = ({ repoUrl }: ShareDialogProps) => {
  const [shareUrl, setShareUrl] = useState("");
  const { toast } = useToast();

  const generateShareableLink = (permission: "view" | "edit") => {
    const baseUrl = window.location.origin;
    const encodedRepo = encodeURIComponent(repoUrl);
    const shareableUrl = `${baseUrl}?repo=${encodedRepo}&mode=${permission}`;
    setShareUrl(shareableUrl);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "The shareable link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-github-darker/50 border-white/10 hover:bg-github-darker/70"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share visualization</DialogTitle>
          <DialogDescription>
            Generate a shareable link to this repository visualization
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => generateShareableLink("view")}
              className="flex-1"
            >
              View Only
            </Button>
            <Button
              variant="outline"
              onClick={() => generateShareableLink("edit")}
              className="flex-1"
            >
              Allow Edits
            </Button>
          </div>
          {shareUrl && (
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="bg-github-darker/50 border-white/10"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;