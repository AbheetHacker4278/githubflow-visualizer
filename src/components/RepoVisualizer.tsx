import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import { useEffect, useState } from "react";
import { fetchRepoData } from "@/services/github";
import { createNodesAndEdges } from "@/utils/flowUtils";
import { Node, Edge } from "@xyflow/react";
import GitHubNode from "./GitHubNode";
import CommitNode from "./CommitNode";
import DeploymentNode from "./DeploymentNode";
import LanguageNode from "./LanguageNode";
import BranchNode from "./BranchNode";
import { LanguageNodeData } from "@/types/nodes";

const nodeTypes = {
  github: GitHubNode,
  commit: CommitNode,
  deployment: DeploymentNode,
  language: LanguageNode,
  branch: BranchNode,
};

interface RepoVisualizerProps {
  repoUrl: string;
}

export const RepoVisualizer = ({ repoUrl }: RepoVisualizerProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    const loadRepoData = async () => {
      if (!repoUrl) return;

      try {
        const regex = /github\.com\/([^/]+)\/([^/]+)/;
        const matches = repoUrl.match(regex);
        if (!matches) return;

        const [, owner, repo] = matches;
        const { repoData, workflows, commits, deployments, languages, branches } =
          await fetchRepoData(owner, repo);

        const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(
          repoData,
          workflows,
          commits,
          deployments,
          languages as Record<string, number>,
          branches
        );

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (error) {
        console.error("Error loading repo data:", error);
      }
    };

    loadRepoData();
  }, [repoUrl]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    if (node.type === "language") {
      const data = node.data as LanguageNodeData;
      console.log("Selected language node:", data);
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      fitView
    >
      <Background color="#58A6FF" className="opacity-9" />
      <Controls className="!bottom-4 !right-4 !top-auto !left-auto" />
      <Panel position="top-left" className="glass-card p-4 rounded-lg max-w-md">
        <h3 className="text-sm font-medium mb-2">Repository Structure</h3>
        <p className="text-xs text-gray-400">
          Visualizing repository structure and workflow
        </p>
        {selectedNode?.type === "language" && (
          <div className="mt-2 p-2 bg-github-darker/30 rounded">
            <p className="text-xs">
              Selected: {(selectedNode.data as LanguageNodeData).language}
            </p>
            <p className="text-xs text-gray-400">
              Usage: {(selectedNode.data as LanguageNodeData).percentage.toFixed(1)}%
            </p>
          </div>
        )}
      </Panel>
    </ReactFlow>
  );
};