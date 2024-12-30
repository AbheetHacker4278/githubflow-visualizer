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

const Index = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
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

  const createNodesAndEdges = (data: any) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let yOffset = 0;

    // Add repository node
    newNodes.push({
      id: "repo",
      type: "github",
      data: { label: data.name, type: "folder" },
      position: { x: 250, y: yOffset },
    });

    yOffset += 100;

    // Add default branch node
    newNodes.push({
      id: "branch",
      type: "github",
      data: { label: data.default_branch, type: "branch" },
      position: { x: 250, y: yOffset },
    });

    newEdges.push({
      id: "e-repo-branch",
      source: "repo",
      target: "branch",
      animated: true,
    });

    // Add workflow files if they exist
    if (data.workflows) {
      yOffset += 100;
      data.workflows.forEach((workflow: any, index: number) => {
        const id = `workflow-${index}`;
        newNodes.push({
          id,
          type: "github",
          data: { label: workflow.name || workflow.path, type: "file" },
          position: { x: 250, y: yOffset },
        });
        newEdges.push({
          id: `e-branch-${id}`,
          source: "branch",
          target: id,
          animated: true,
        });
        yOffset += 100;
      });
    }

    return { nodes: newNodes, edges: newEdges };
  };

  const fetchRepoData = async (owner: string, repo: string) => {
    try {
      // Fetch repository information
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoResponse.ok) throw new Error("Repository not found");
      const repoData = await repoResponse.json();

      // Fetch workflow files
      const workflowsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`
      );
      
      if (workflowsResponse.ok) {
        const workflowsData = await workflowsResponse.json();
        repoData.workflows = workflowsData;
      }

      return repoData;
    } catch (error) {
      console.error("Error fetching repository data:", error);
      throw error;
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
      const repoData = await fetchRepoData(owner, repo);
      const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(repoData);
      
      setNodes(newNodes);
      setEdges(newEdges);
      
      toast({
        title: "Success",
        description: "Repository workflow visualization created!",
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
              Visualizing the repository workflow structure
            </p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default Index;