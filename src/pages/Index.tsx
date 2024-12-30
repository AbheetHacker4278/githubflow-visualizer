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
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  github: GitHubNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "github",
    data: { label: "main", type: "branch" },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    type: "github",
    data: { label: "src", type: "folder" },
    position: { x: 250, y: 100 },
  },
  {
    id: "3",
    type: "github",
    data: { label: "App.tsx", type: "file" },
    position: { x: 250, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

const Index = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    // Here we would normally fetch the repository data
    // For now, we'll just show a success message
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Success",
      description: "Repository structure loaded successfully!",
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col gap-8">
      <div className="max-w-2xl mx-auto w-full text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
          GitHub Flow Visualizer
        </h1>
        <p className="text-gray-400 mb-8">
          Enter a GitHub repository URL to visualize its structure
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
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#58A6FF" className="opacity-5" />
          <Controls className="!bottom-4 !right-4 !top-auto !left-auto" />
          <Panel position="top-left" className="glass-card p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Repository Structure</h3>
            <p className="text-xs text-gray-400">
              Visualizing the main branch and its contents
            </p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default Index;