
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
import { Plus, Maximize2, Minimize2 } from "lucide-react";

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
      style: { 
        stroke: isAnnotationConnection ? '#39FF14' : '#58A6FF', 
        strokeWidth: isAnnotationConnection ? 3 : 2,
        opacity: isAnnotationConnection ? 0.8 : 1,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isAnnotationConnection ? '#39FF14' : '#58A6FF',
      },
    };
    
    setEdges((eds) => [...eds, edge]);
    
    toast({
      title: "Connection Created",
      description: "Annotation has been connected successfully",
    });
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
          style: { stroke: '#58A6FF', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#58A6FF',
          },
        }}
        fitView
      >
        <Background color="#58A6FF" className="opacity-9" />
        <Controls className="!bottom-4 !right-4 !top-auto !left-auto text-black hover:bg-white" />
        <Panel position="top-right" className="flex gap-2 p-2">
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
