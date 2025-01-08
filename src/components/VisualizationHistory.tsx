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
import { History, ExternalLink } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const VisualizationHistory = () => {
  const [open, setOpen] = useState(false);
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
      return data;
    },
    enabled: !!session,
  });

  const handleRepoClick = (repoUrl: string) => {
    console.log("Visualizing repository:", repoUrl);
    setOpen(false);
    
    // Use URLSearchParams to update the URL without page reload
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("repo", encodeURIComponent(repoUrl));
    navigate(`/app?repo=${encodeURIComponent(repoUrl)}`);

    toast({
      title: "Loading Repository",
      description: "Fetching and visualizing repository data...",
    });
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
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleRepoClick(item.repo_url)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      {item.repo_owner}/{item.repo_name}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(item.visualized_at).toLocaleDateString()}
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