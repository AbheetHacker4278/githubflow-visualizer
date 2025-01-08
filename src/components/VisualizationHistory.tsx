import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, ExternalLink, Copy, Check } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const VisualizationHistory = () => {
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery({
    queryKey: ["visualization-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visualization_history")
        .select("*")
        .order("visualized_at", { ascending: false });

      if (error) throw error;

      // Process data to get unique repos with counts
      const repoMap = data.reduce((acc, item) => {
        const repoKey = `${item.repo_owner}/${item.repo_name}`;
        if (!acc[repoKey]) {
          acc[repoKey] = {
            id: item.id,
            repo_owner: item.repo_owner,
            repo_name: item.repo_name,
            repo_url: item.repo_url,
            last_visited: item.visualized_at,
            visit_count: 1
          };
        } else {
          acc[repoKey].visit_count += 1;
          if (new Date(item.visualized_at) > new Date(acc[repoKey].last_visited)) {
            acc[repoKey].last_visited = item.visualized_at;
          }
        }
        return acc;
      }, {});

      return Object.values(repoMap);
    },
    enabled: !!session,
  });

  const handleRepoClick = (repoUrl: string) => {
    setOpen(false);
    navigate(`/app?repo=${encodeURIComponent(repoUrl)}`);
    toast({
      title: "Loading Repository",
      description: "Fetching and visualizing repository data...",
    });
  };

  const handleCopyClick = async (e: React.MouseEvent, repoUrl: string, id: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(repoUrl);
      setCopiedId(id);
      toast({
        title: "URL Copied",
        description: "Repository URL has been copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!session) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-16 z-50 rounded-full hover:bg-github-darker/50"
        >
          <History className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Visualization History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : !history?.length ? (
            <p className="text-center text-muted-foreground">No history yet</p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer relative group"
                  onClick={() => handleRepoClick(item.repo_url)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {item.repo_owner}/{item.repo_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {item.visit_count} {item.visit_count === 1 ? 'visit' : 'visits'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleCopyClick(e, item.repo_url, item.id)}
                      >
                        {copiedId === item.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last visited: {new Date(item.last_visited).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default VisualizationHistory;