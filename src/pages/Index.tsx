import { useState, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  Panel,
  OnNodesChange,
  NodeChange,
  applyNodeChanges,
} from "@xyflow/react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import GitHubNode from "@/components/GitHubNode";
import CommitNode from "@/components/CommitNode";
import DeploymentNode from "@/components/DeploymentNode";
import LanguageNode from "@/components/LanguageNode";
import BranchNode from "@/components/BranchNode";
import { UserMenu } from "@/components/UserMenu";
import { fetchRepoData } from "@/services/github";
import { createNodesAndEdges } from "@/utils/flowUtils";
import { BranchNodeData, DeploymentNodeData } from "@/types/nodes";
import BranchDetailsPanel from "@/components/BranchDetailsPanel";
import DeploymentDetailsPanel from "@/components/DeploymentDetailsPanel";
import ShareDialog from "@/components/ShareDialog";
import ChatBot from "@/components/ChatBot";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  github: GitHubNode,
  commit: CommitNode,
  deployment: DeploymentNode,
  language: LanguageNode,
  branch: BranchNode,
};

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { toast } = useToast();
  const flowRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Node<BranchNodeData> | null>(null);
  const [selectedDeployment, setSelectedDeployment] = useState<Node<DeploymentNodeData> | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [hasAttemptedInitialLoad, setHasAttemptedInitialLoad] = useState(false);

  useEffect(() => {
    const sharedRepo = searchParams.get("repo");
    const mode = searchParams.get("mode");
    
    if (sharedRepo && !hasAttemptedInitialLoad) {
      const decodedUrl = decodeURIComponent(sharedRepo);
      console.log("Loading shared repository:", decodedUrl);
      setRepoUrl(decodedUrl);
      setIsReadOnly(mode === "view");
      handleSubmit(null, decodedUrl);
      setHasAttemptedInitialLoad(true);
    }
  }, [searchParams, hasAttemptedInitialLoad]);

  const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
    if (!isReadOnly) {
      setNodes((nds) => applyNodeChanges(changes, nds));
    }
  };

  const onNodeClick = (_: React.MouseEvent<HTMLDivElement>, node: Node) => {
    setSelectedNode(node);
    if (node.type === 'branch') {
      setSelectedBranch(node as Node<BranchNodeData>);
    } else if (node.type === 'deployment') {
      setSelectedDeployment(node as Node<DeploymentNodeData>);
    }
  };

  const handleHomeClick = () => {
    console.log("Attempting to navigate to landing page...");
    navigate("/", { replace: true });
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

  const handleSubmit = async (e: React.FormEvent | null, sharedRepoUrl?: string) => {
    if (e) e.preventDefault();
    const urlToUse = sharedRepoUrl || repoUrl;
    
    if (!urlToUse) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { owner, repo } = extractRepoInfo(urlToUse);
      console.log("Fetching repository data for:", owner, repo);
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
      setBranches(branches.map(branch => branch.name));

      toast({
        title: "Success",
        description: `Repository visualization created with ${Object.keys(languages).length} languages${workflows.length > 0 ? ', workflows' : ''}, commits, deployments, and ${branches.length} branches!`,
      });
    } catch (error: any) {
      console.error("Error loading repository:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch repository data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      flowRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
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
        <div className="flex items-center gap-4">
          {repoUrl && <ShareDialog repoUrl={repoUrl} />}
          <UserMenu />
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
          GitHub Flow Visualizer
        </h1>
        <p className="text-gray-400 mb-8">
          {isReadOnly ? "Viewing shared repository visualization" : "Enter a GitHub repository URL to visualize its workflow structure"}
        </p>

        {!isReadOnly && (
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
              className="relative px-6 py-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-white font-medium shadow-lg transition-all duration-200 hover:bg-black/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-black/40 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-t before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity overflow-hidden"
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
        )}
      </div>

      <div ref={flowRef} className="flow-container relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          fitView
          nodesDraggable={!isReadOnly}
          nodesConnectable={!isReadOnly}
        >
          <Background color="#58A6FF" className="opacity-9" />
          <Controls className="!bottom-4 !right-4 !top-auto !left-auto text-black hover:bg-white" />
          <Panel position="top-right" className="p-2">
            <Button onClick={toggleFullscreen} className="bg-gray-700 text-white px-4 py-2 rounded-md">
              {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            </Button>
          </Panel>
          <Panel position="top-left" className="glass-card p-4 rounded-lg max-w-72">
            <h3 className="text-sm font-medium mb-2">Repository Structure</h3>
            <p className="text-xs text-gray-400 mb-2">
              Visualizing repository languages, workflow, commits, and deployments
            </p>
            {branches.length > 0 && (
              <div>
                <h4 className="text-xs font-medium mb-1">Branches ({branches.length}):</h4>
                <ul className="text-xs text-gray-400 list-disc list-inside max-h-32 overflow-y-auto">
                  {branches.map((branch, index) => (
                    <li key={index}>{branch}</li>
                  ))}
                </ul>
              </div>
            )}
          </Panel>
        </ReactFlow>
      </div>

      {selectedBranch && (
        <BranchDetailsPanel
          isOpen={!!selectedBranch}
          onClose={() => setSelectedBranch(null)}
          branchName={selectedBranch.data.label}
          commits={selectedBranch.data.commits || []}
          heatLevel={selectedBranch.data.heatLevel}
          isCollapsed={selectedBranch.data.isCollapsed}
          tags={selectedBranch.data.tags || []}
          fileChanges={selectedBranch.data.fileChanges || []}
          contributors={selectedBranch.data.contributors || []}
          isFullscreen={isFullscreen}
        />
      )}

      {selectedDeployment && (
        <DeploymentDetailsPanel
          deployment={selectedDeployment.data}
          onClose={() => setSelectedDeployment(null)}
        />
      )}

      <ChatBot repoUrl={repoUrl} />
    </div>
  );
};

export default Index;