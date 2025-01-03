import { ReactFlow, Background, Controls, Edge, Node, Panel } from "@xyflow/react";
import { LanguageNodeData } from "@/types/nodes";
import GitHubNode from "./GitHubNode";
import CommitNode from "./CommitNode";
import DeploymentNode from "./DeploymentNode";
import LanguageNode from "./LanguageNode";
import BranchNode from "./BranchNode";

const nodeTypes = {
  github: GitHubNode,
  commit: CommitNode,
  deployment: DeploymentNode,
  language: LanguageNode,
  branch: BranchNode,
};

interface RepoVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onNodeClick: (event: React.MouseEvent<HTMLDivElement>, node: Node) => void;
  selectedNode: Node | null;
  branches: string[];
}

export const RepoVisualizer = ({
  nodes,
  edges,
  onNodesChange,
  onNodeClick,
  selectedNode,
  branches,
}: RepoVisualizerProps) => {
  return (
    <div className="flow-container">
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
        <Panel position="top-left" className="glass-card p-4 rounded-lg max-w-md">
          <h3 className="text-sm font-medium mb-2">Repository Structure</h3>
          <p className="text-xs text-gray-400 mb-2">
            Visualizing repository languages, workflow, commits, and deployments
          </p>
          {selectedNode?.type === "language" && (
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
    </div>
  );
};