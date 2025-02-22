
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RepoVisualizerFormProps {
  onSubmit: (url: string) => Promise<void>;
  loading: boolean;
}

export const RepoVisualizerForm = ({ onSubmit, loading }: RepoVisualizerFormProps) => {
  const [repoUrl, setRepoUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }
    await onSubmit(repoUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 glass-card p-4 rounded-lg">
      <Input
        type="text"
        placeholder="https://github.com/username/repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        className="bg-github-darker/50 border-white/10"
      />
      <Button
        type="submit"
        disabled={loading}
        className={`
          relative px-6 py-2.5
          bg-black/40 backdrop-blur-md
          border border-white/10
          rounded-lg
          text-white
          font-medium
          shadow-lg
          transition-all duration-200
          hover:bg-black/50
          hover:shadow-xl
          hover:scale-[1.02]
          active:scale-[0.98]
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:scale-100
          disabled:hover:bg-black/40
          before:absolute
          before:inset-0
          before:rounded-lg
          before:bg-gradient-to-t
          before:from-white/5
          before:to-transparent
          before:opacity-0
          hover:before:opacity-100
          before:transition-opacity
          overflow-hidden
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          "Visualize"
        )}
      </Button>
    </form>
  );
};
