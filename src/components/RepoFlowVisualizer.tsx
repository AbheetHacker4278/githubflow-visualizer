import { useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import GitHubNode from "@/components/GitHubNode";
import CommitNode from "@/components/CommitNode";
import DeploymentNode from "@/components/DeploymentNode";
import LanguageNode from "@/components/LanguageNode";
import BranchNode from "@/components/BranchNode";
import BranchDetailsPanel from "@/components/BranchDetailsPanel";
import DeploymentDetailsPanel from "@/components/DeploymentDetailsPanel";
import { LanguageNodeData, DeploymentNodeData } from "@/types/nodes";
import { Tag, FileChange, GitHubCommit } from "@/types/github";

const nodeTypes = {
  github: GitHubNode,
  commit: CommitNode,
  deployment: DeploymentNode,
  language: LanguageNode,
  branch: BranchNode,
};

interface RepoFlowVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  branches: string[];
  onNodesChange: OnNodesChange;
}

export const RepoFlowVisualizer = ({
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

  const defaultCommits: GitHubCommit[] = [];
  const defaultTags: Tag[] = [];
  const defaultFileChanges: FileChange[] = [];

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
          commits={selectedBranch.data.commits || defaultCommits}
          heatLevel={selectedBranch.data.heatLevel as number}
          isCollapsed={selectedBranch.data.isCollapsed as boolean}
          tags={selectedBranch.data.tags || defaultTags}
          fileChanges={selectedBranch.data.fileChanges || defaultFileChanges}
          isFullscreen={isFullscreen}
        />
      )}

      {selectedNode?.type === 'deployment' && (
        <DeploymentDetailsPanel deployment={selectedNode.data as DeploymentNodeData} />
      )}
    </div>
  );
};
