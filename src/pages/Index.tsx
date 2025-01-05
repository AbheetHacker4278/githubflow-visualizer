import { useState, useRef, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Edge,
  Node,
  Panel,
  OnNodesChange,
  NodeChange,
  applyNodeChanges,
  useReactFlow,
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
import { LanguageNodeData } from "@/types/nodes";
import BranchDetailsPanel from "@/components/BranchDetailsPanel";
import DeploymentDetailsPanel from "@/components/DeploymentDetailsPanel";
import ShareButton from "@/components/ShareButton";
import { decodeShareableState } from "@/utils/shareUtils";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  github: GitHubNode,
  commit: CommitNode,
  deployment: DeploymentNode,
  language: LanguageNode,
  branch: BranchNode,
};

const FlowContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setViewport } = useReactFlow();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { toast } = useToast();
  const flowRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Node | null>(null);

  // Handle shared state on mount
  useEffect(() => {
    const shareParam = searchParams.get('share');
    if (shareParam) {
      const sharedState = decodeShareableState(shareParam);
      if (sharedState) {
        setRepoUrl(sharedState.repoUrl);
        if (sharedState.position && sharedState.zoomLevel) {
          setViewport({ 
            x: sharedState.position.x, 
            y: sharedState.position.y, 
            zoom: sharedState.zoomLevel 
          });
        }
        handleSubmit(new Event('submit') as any, sharedState.repoUrl);
      }
    }
  }, [searchParams]);

  const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onNodeClick = (_: React.MouseEvent<HTMLDivElement>, node: Node) => {
    setSelectedNode(node);
    if (node.type === 'branch') {
      setSelectedBranch(node);
    }
    if (node.type === 'language') {
      const data = node.data as LanguageNodeData;
      const percentage = data.percentage.toFixed(1);
      toast({
        title: "Node Selected",
        description: `Selected language: ${data.language} (${percentage}%)`,
      });
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

  const handleSubmit = async (e: React.FormEvent, initialUrl?: string) => {
    e.preventDefault();
    const urlToUse = initialUrl || repoUrl;
    
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

  const { getViewport } = useReactFlow();

  return (
    <div ref={flowRef} className="flow-container relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#58A6FF" className="opacity-9" />
        <Controls className="!bottom-4 !right-4 !top-auto !left-auto text-black hover:bg-white" />
        <Panel position="top-right" className="flex gap-2 p-2">
          <ShareButton
            state={{
              repoUrl,
              selectedNodeId: selectedNode?.id,
              ...getViewport(),
            }}
          />
          <Button onClick={toggleFullscreen} className="bg-gray-700 text-white px-4 py-2 rounded-md">
            {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          </Button>
        </Panel>
        <Panel position="top-left" className="glass-card p-4 rounded-lg max-w-72">
          <h3 className="text-sm font-medium mb-2">Repository Structure</h3>
          <p className="text-xs text-gray-400 mb-2">
            Visualizing repository languages, workflow, commits, and deployments
          </p>
          {selectedNode?.type === 'language' && (
            <div className="mt-2 p-2 bg-github-darker/30 rounded">
              <p className="text-xs">Selected: {(selectedNode.data as LanguageNodeData).language}</p>
              <p className="text-xs text-gray-400">
                Usage: {(selectedNode.data as LanguageNodeData).percentage.toFixed(1)}%
              </p>
            </div>
          )}
        </Panel>
      </ReactFlow>

      {selectedBranch && (
        <BranchDetailsPanel
          isOpen={!!selectedBranch}
          onClose={() => setSelectedBranch(null)}
          branchName={selectedBranch.data.label || ""}
          commits={selectedBranch.data.commits || []}
          heatLevel={selectedBranch.data.heatLevel || 0}
          isCollapsed={selectedBranch.data.isCollapsed || false}
          tags={selectedBranch.data.tags || []}
          fileChanges={selectedBranch.data.fileChanges || []}
          contributors={selectedBranch.data.contributors || []}
          isFullscreen={isFullscreen}
        />
      )}
    </div>
  );
};

const Index = () => {
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

        <ReactFlowProvider>
          <FlowContent />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Index;
