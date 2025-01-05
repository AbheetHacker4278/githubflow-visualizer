import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createShareableUrl } from "@/utils/shareUtils";
import { ShareableState } from "@/types/sharing";

interface ShareButtonProps {
  state: ShareableState;
}

const ShareButton = ({ state }: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = createShareableUrl(state);
    
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share this link to show others your repository visualization.",
      });
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast({
        title: "Failed to copy link",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="flex items-center gap-2 bg-github-accent hover:bg-github-accent/90"
    >
      <Share2 className="w-4 h-4" />
      Share View
    </Button>
  );
};

export default ShareButton;