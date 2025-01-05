import { Node, Edge } from '@xyflow/react';
import { DeploymentNodeData } from '@/types/nodes';

interface Branch {
  name: string;
  date: string;
}

interface Deployment {
  label: string;
  environment: string;
  status: string;
  date: string;
}

export const createNodesAndEdges = (
  repoData: any,
  workflows: any[],
  commits: any[],
  deployments: Deployment[],
  languages: Record<string, number>,
  branches: Branch[]
) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create nodes for each branch
  branches.forEach((branch, index) => {
    nodes.push({
      id: `branch-${index}`,
      type: 'branch',
      data: { label: branch.name, date: branch.date },
      position: { x: index * 100, y: 0 },
    });
  });

  // Create nodes for each deployment
  deployments.forEach((deployment, index) => {
    nodes.push({
      id: `deployment-${index}`,
      type: 'deployment',
      data: { ...deployment },
      position: { x: index * 100, y: 100 },
    });
  });

  // Create edges between branches and deployments
  branches.forEach((branch, branchIndex) => {
    deployments.forEach((deployment, deploymentIndex) => {
      edges.push({
        id: `edge-${branchIndex}-${deploymentIndex}`,
        source: `branch-${branchIndex}`,
        target: `deployment-${deploymentIndex}`,
      });
    });
  });

  return { nodes, edges };
};
