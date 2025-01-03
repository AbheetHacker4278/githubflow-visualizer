import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserMenu } from "@/components/UserMenu";
import { EducationMode } from "@/components/GitEducation/EducationMode";
import { RepoVisualizer } from "@/components/RepoVisualizer";

const Index = () => {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const { toast } = useToast();

  const extractRepoInfo = (url: string) => {
    try {
      const regex = /github\.com\/([^/]+)\/([^/]+)/;
      const matches = url.match(regex);
      if (!matches) throw new Error("Invalid GitHub URL");
      return { owner: matches[1], repo: matches[2] };
    } catch (error) {
      throw new Error("Invalid GitHub URL format");
    }
  };

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

    setLoading(true);
    try {
      const { owner, repo } = extractRepoInfo(repoUrl);
      toast({
        title: "Success",
        description: "Repository visualization created!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch repository data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            GitViz
          </span>
        </a>
        <UserMenu />
      </div>

      <div className="max-w-2xl mx-auto w-full text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
          GitHub Flow Visualizer
        </h1>
        <p className="text-gray-400 mb-8">
          Enter a GitHub repository URL to visualize its workflow structure
        </p>

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
            className="relative px-6 py-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg"
          >
            {loading ? "Loading..." : "Visualize"}
          </Button>
        </form>

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setShowEducation(!showEducation)}
            className="text-github-accent"
          >
            {showEducation ? "Hide" : "Show"} GitHub Flow Guide
          </Button>
        </div>
      </div>

      {showEducation && <EducationMode />}

      <div className="flow-container">
        <RepoVisualizer repoUrl={repoUrl} />
      </div>
    </div>
  );
};

export default Index;