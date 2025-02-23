import { useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  Panel,
  OnNodesChange,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import GitHubNode from "@/components/GitHubNode";
import CommitNode from "@/components/CommitNode";
import DeploymentNode from "@/components/DeploymentNode";
import LanguageNode from "@/components/LanguageNode";
import BranchNode from "@/components/BranchNode";
import CustomAnnotation from "@/components/CustomAnnotation";
import BranchDetailsPanel from "@/components/BranchDetailsPanel";
import DeploymentDetailsPanel from "@/components/DeploymentDetailsPanel";
import { LanguageNodeData, DeploymentNodeData } from "@/types/nodes";
import { Plus, Maximize2, Minimize2, Eye, ExternalLink } from "lucide-react";

const nodeTypes = {
  github: GitHubNode,
  commit: CommitNode,
  deployment: DeploymentNode,
  language: LanguageNode,
  branch: BranchNode,
  annotation: CustomAnnotation,
};

interface RepoFlowVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  branches: string[];
  onNodesChange: OnNodesChange;
}

const Flow = ({
  nodes,
  edges,
  branches,
  onNodesChange,
}: RepoFlowVisualizerProps) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { setNodes, setEdges } = useReactFlow();

  const handleLivePreview = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const repoUrl = urlParams.get('repo');
    
    if (repoUrl) {
      const previewUrl = repoUrl.replace('github.com', 'githubbox.com');
      window.open(previewUrl, '_blank');
      
      toast({
        title: "Live Preview",
        description: "Opening repository in CodeSandbox...",
      });
    } else {
      toast({
        title: "Error",
        description: "Repository URL not found",
        variant: "destructive",
      });
    }
  };

  const handleDeploymentPreview = () => {
    const deploymentNode = nodes.find(node => node.type === 'deployment' && 
      (node.data as DeploymentNodeData).status === 'success');
    
    if (deploymentNode) {
      const deploymentUrl = (deploymentNode.data as DeploymentNodeData).url;
      if (deploymentUrl) {
        window.open(deploymentUrl, '_blank');
        toast({
          title: "Deployment Preview",
          description: "Opening deployed version...",
        });
      }
    } else {
      toast({
        title: "No Deployment",
        description: "No active deployment found for this repository",
        variant: "destructive",
      });
    }
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      flowRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getNodeLabel = (node: Node | undefined) => {
    if (!node) return '';
    if (node.type === 'deployment') {
      return (node.data as any).label || 'Deployment';
    }
    if (node.type === 'language') {
      return (node.data as any).language || 'Language';
    }
    if (node.type === 'commit') {
      return (node.data as any).message?.slice(0, 20) + '...' || 'Commit';
    }
    if (node.type === 'annotation') {
      return node.data.label || 'Annotation';
    }
    return node.type || 'Node';
  };

  const addCustomAnnotation = () => {
    const newNode = {
      id: `annotation-${Date.now()}`,
      type: 'annotation',
      data: { label: 'New Annotation', isEditing: true },
      position: { x: 100, y: 100 },
    };

    setNodes((nds) => [...nds, newNode]);
    toast({
      title: "Annotation Added",
      description: "Drag to position and edit the text as needed",
    });
  };

  const onConnect = (params: any) => {
    const isAnnotationConnection = nodes.some(
      node => (node.id === params.source || node.id === params.target) && 
      node.type === 'annotation'
    );

    const edge = {
      ...params,
      id: `edge-${Date.now()}`,
      animated: true,
      className: isAnnotationConnection ? 'annotation-connection' : '',
      style: { 
        strokeWidth: isAnnotationConnection ? 3 : 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isAnnotationConnection ? '#39FF14' : '#58A6FF',
      },
    };
    
    setEdges((eds) => [...eds, edge]);
    
    if (isAnnotationConnection) {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      const sourceName = getNodeLabel(sourceNode);
      const targetName = getNodeLabel(targetNode);
      
      toast({
        title: "Connection Created",
        description: (
          <div className="flex flex-col">
            <span className="text-[#39FF14] font-medium flex items-center gap-2">
              {sourceName}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {targetName}
            </span>
            <span className="text-xs opacity-80">Path connection established</span>
          </div>
        ),
        className: "border-[#39FF14]/30 bg-[#39FF14]/10",
      });
    } else {
      toast({
        title: "Connection Created",
        description: "Connection added successfully",
      });
    }
  };

  return (
    <div ref={flowRef} className="flow-container relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
        fitView
      >
        <Background color="#58A6FF" className="opacity-9" />
        <Controls className="!bottom-4 !right-4 !top-auto !left-auto text-black hover:bg-white" />
        <Panel position="top-right" className="flex gap-2 p-2">
          <Button
            onClick={handleLivePreview}
            className="bg-emerald-600/40 text-white hover:bg-emerald-600/60 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </Button>
          <Button
            onClick={handleDeploymentPreview}
            className="bg-purple-600/40 text-white hover:bg-purple-600/60 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Deployment
          </Button>
          <Button
            onClick={addCustomAnnotation}
            className="bg-github-accent/20 text-white hover:bg-github-accent/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Annotation
          </Button>
          <Button onClick={toggleFullscreen} className="bg-gray-700 text-white flex items-center gap-2">
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                Enter Fullscreen
              </>
            )}
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

      {selectedBranch && selectedBranch.data && (
        <BranchDetailsPanel
          isOpen={!!selectedBranch}
          onClose={() => setSelectedBranch(null)}
          branchName={selectedBranch.data.label as string}
          commits={(selectedBranch.data.commits || []) as Array<{sha: string; message: string; date: string}>}
          heatLevel={selectedBranch.data.heatLevel as number}
          isCollapsed={selectedBranch.data.isCollapsed as boolean}
          tags={(selectedBranch.data.tags || []) as Array<{name: string; type: "lightweight" | "annotated"; message?: string}>}
          fileChanges={(selectedBranch.data.fileChanges || []) as Array<{path: string; changes: number}>}
          isFullscreen={isFullscreen}
        />
      )}

      {selectedNode?.type === 'deployment' && (
        <DeploymentDetailsPanel deployment={selectedNode.data as DeploymentNodeData} />
      )}
    </div>
  );
};

export const RepoFlowVisualizer = (props: RepoFlowVisualizerProps) => (
  <ReactFlowProvider>
    <Flow {...props} />
  </ReactFlowProvider>
);
