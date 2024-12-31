import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  Panel,
} from "@xyflow/react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GitHubNode from "@/components/GitHubNode";
import CommitNode from "@/components/CommitNode";
import DeploymentNode from "@/components/DeploymentNode";
import LanguageNode from "@/components/LanguageNode";
import { fetchRepoData, initializeGitHubToken } from "@/services/github";
import { createNodesAndEdges } from "@/utils/flowUtils";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  github: GitHubNode,
  commit: CommitNode,
  deployment: DeploymentNode,
  language: LanguageNode,
};

const Index = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem('GITHUB_TOKEN'));
  const [githubToken, setGithubToken] = useState("");
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

  const handleSetToken = () => {
    if (!githubToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid GitHub token",
        variant: "destructive",
      });
      return;
    }
    
    initializeGitHubToken(githubToken);
    setShowTokenInput(false);
    toast({
      title: "Success",
      description: "GitHub token has been set",
    });
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
      const { repoData, workflows, commits, deployments, languages, branches } = await fetchRepoData(owner, repo);
      const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(
        repoData,
        workflows,
        commits,
        deployments,
        languages,
        branches
      );
      
      setNodes(newNodes);
      setEdges(newEdges);
      
      toast({
        title: "Success",
        description: `Repository visualization created with ${Object.keys(languages).length} languages${workflows.length > 0 ? ', workflows' : ''}, commits and deployments!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch repository data",
        variant: "destructive",
      });
      
      // Show token input if rate limit error
      if (error.message?.includes('rate limit exceeded')) {
        setShowTokenInput(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showTokenInput) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
            GitHub Authentication
          </h1>
          <p className="text-gray-400 mb-8">
            Please provide a GitHub token to continue. This will increase your API rate limits.
          </p>

          <div className="glass-card p-4 rounded-lg flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Enter GitHub token"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
            <Button
              onClick={handleSetToken}
              className="bg-github-accent hover:bg-github-accent/80"
            >
              Set Token
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8">
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
            className="bg-github-accent hover:bg-github-accent/80"
          >
            {loading ? "Loading..." : "Visualize"}
          </Button>
        </form>
      </div>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#58A6FF" className="opacity-5" />
          <Controls className="!bottom-4 !right-4 !top-auto !left-auto" />
          <Panel position="top-left" className="glass-card p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Repository Structure</h3>
            <p className="text-xs text-gray-400">
              Visualizing repository languages, workflow, commits, and deployments
            </p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default Index;