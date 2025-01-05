import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Node, Edge, NodeChange, applyNodeChanges, ReactFlowProvider } from "@xyflow/react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { fetchRepoData } from "@/services/github";
import { createNodesAndEdges } from "@/utils/flowUtils";
import FlowContent from "@/components/FlowContent";
import "@xyflow/react/dist/style.css";

const Index = () => {
  const [searchParams] = useSearchParams();
  const isReadOnly = searchParams.get("readonly") === "true";
  const viewState = searchParams.get("view");

  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (viewState) {
      try {
        const state = JSON.parse(decodeURIComponent(viewState));
        setNodes(state.nodes || []);
        setEdges(state.edges || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load shared view state",
          variant: "destructive",
        });
      }
    }
  }, [viewState, toast]);

  const onNodesChange = (changes: NodeChange[]) => {
    if (!isReadOnly) {
      setNodes((nds) => applyNodeChanges(changes, nds));
    }
  };

  const onNodeClick = (_: React.MouseEvent<HTMLDivElement>, node: Node) => {
    if (isReadOnly) return;
    if (node.type === 'language') {
      const data = node.data as LanguageNodeData;
      const percentage = data.percentage.toFixed(1);
      toast({
        title: "Node Selected",
        description: `Selected language: ${data.language} (${percentage}%)`,
      });
    }
  };

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
    if (isReadOnly) return;
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
        description: `Repository visualization created with ${Object.keys(languages).length} languages${workflows.length > 0 ? ', workflows' : ''}, commits, deployments, and ${branches.length} branches!`,
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
    <ReactFlowProvider>
      <div className="min-h-screen p-8 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              GitViz
            </span>
          </a>
          <UserMenu />
        </div>

        {!isReadOnly && (
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
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Visualize"}
              </Button>
            </form>
          </div>
        )}

        <FlowContent
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          isReadOnly={isReadOnly}
        />
      </div>
    </ReactFlowProvider>
  );
};

export default Index;