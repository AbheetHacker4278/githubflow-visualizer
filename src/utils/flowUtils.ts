import { Node, Edge } from '@xyflow/react';
import { GitHubBranch, GitHubDeployment, Deployment } from '@/types/github';

export const createNodesAndEdges = (
  repoData: any,
  workflows: any[],
  commits: any[],
  deployments: GitHubDeployment[],
  languages: Record<string, number>,
  branches: GitHubBranch[]
) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create nodes for each branch
  branches.forEach((branch, index) => {
    nodes.push({
      id: `branch-${index}`,
      type: 'branch',
      data: { 
        label: branch.name,
        commits: [],
        heatLevel: 0,
        isCollapsed: false,
        tags: [],
        fileChanges: []
      },
      position: { x: index * 100, y: 0 },
    });
  });

  // Transform GitHubDeployment to Deployment
  const transformedDeployments: Deployment[] = deployments.map(deployment => ({
    label: `Deployment ${deployment.id}`,
    environment: deployment.environment,
    status: deployment.state,
    date: deployment.created_at
  }));

  // Create nodes for each deployment
  transformedDeployments.forEach((deployment, index) => {
    nodes.push({
      id: `deployment-${index}`,
      type: 'deployment',
      data: deployment,
      position: { x: index * 100, y: 100 },
    });
  });

  // Create edges between branches and deployments
  branches.forEach((branch, branchIndex) => {
    transformedDeployments.forEach((deployment, deploymentIndex) => {
      edges.push({
        id: `edge-${branchIndex}-${deploymentIndex}`,
        source: `branch-${branchIndex}`,
        target: `deployment-${deploymentIndex}`,
      });
    });
  });

  return { nodes, edges };
};