import { useState, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";
import { useToast } from "@/hooks/use-toast";
import { UserMenu } from "@/components/UserMenu";
import GitHubNode from "@/components/GitHubNode";
import CommitNode from "@/components/CommitNode";
import DeploymentNode from "@/components/DeploymentNode";
import LanguageNode from "@/components/LanguageNode";
import BranchNode from "@/components/BranchNode";
import BranchDetailsPanel from "@/components/BranchDetailsPanel";
import { ShareDialog } from "@/components/ShareDialog";
import RepositoryForm from "@/components/RepositoryForm";
import { fetchRepoData } from "@/services/github";
import { createNodesAndEdges } from "@/utils/flowUtils";
import { getStateFromUrl } from "@/utils/shareUtils";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  github: GitHubNode,
  commit: CommitNode,
  deployment: DeploymentNode,
  language: LanguageNode,
  branch: BranchNode,
};

const FlowContent = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      flowRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getCurrentState = () => ({
    nodes,
    edges,
    zoom: 1,
    position: [0, 0] as [number, number],
  });

  return (
    <div ref={flowRef} className="flow-container relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setSelectedNode(node)}
        fitView
      >
        <Background color="#58A6FF" className="opacity-9" />
        <Controls className="!bottom-4 !right-4 !top-auto !left-auto text-black hover:bg-white" />
        <Panel position="top-right" className="space-x-2">
          <Button onClick={toggleFullscreen} className="bg-gray-700 text-white px-4 py-2 rounded-md">
            {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          </Button>
          <ShareDialog currentState={getCurrentState()} />
        </Panel>
      </ReactFlow>
      
      {selectedBranch && (
        <BranchDetailsPanel
          isOpen={!!selectedBranch}
          onClose={() => setSelectedBranch(null)}
          branchName={selectedBranch.data.label}
          commits={selectedBranch.data.commits}
          heatLevel={selectedBranch.data.heatLevel}
          isCollapsed={selectedBranch.data.isCollapsed}
          tags={selectedBranch.data.tags}
          fileChanges={selectedBranch.data.fileChanges}
          contributors={selectedBranch.data.contributors}
          isFullscreen={isFullscreen}
        />
      )}
    </div>
  );
};

const Index = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedState = getStateFromUrl();
    if (savedState) {
      setNodes(savedState.nodes);
      setEdges(savedState.edges);
      toast({
        title: "Shared View Loaded",
        description: "Viewing a shared repository visualization",
      });
    }
  }, []);

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

        <div className="max-w-2xl mx-auto w-full text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
            GitHub Flow Visualizer
          </h1>
          <p className="text-gray-400 mb-8">
            Enter a GitHub repository URL to visualize its workflow structure
          </p>

          <RepositoryForm
            repoUrl={repoUrl}
            setRepoUrl={setRepoUrl}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </div>

        <FlowContent />
      </div>
    </ReactFlowProvider>
  );
};

export default Index;