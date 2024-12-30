import { Node, Edge } from "@xyflow/react";
import { GitHubCommit, GitHubDeployment, GitHubBranch } from "../services/github";

export const createNodesAndEdges = (
  data: any,
  workflows: any[] = [],
  commits: GitHubCommit[] = [],
  deployments: GitHubDeployment[] = [],
  branches: GitHubBranch[] = [],
  pulls: any[] = []
) => {
  const newNodes: Node[] = [];
  const newEdges: Edge[] = [];
  let yOffset = 0;

  // Add repository node
  newNodes.push({
    id: "repo",
    type: "github",
    data: { label: data.name, type: "folder" },
    position: { x: 250, y: yOffset },
  });

  yOffset += 100;

  // Add branch nodes
  const branchSpacing = 300;
  branches.forEach((branch, index) => {
    const branchId = `branch-${branch.name}`;
    newNodes.push({
      id: branchId,
      type: "github",
      data: { 
        label: branch.name,
        type: "branch",
        commitCount: commits.filter(c => c.sha === branch.commit.sha).length,
        pullCount: pulls.filter(pr => pr.head.ref === branch.name).length
      },
      position: { x: index * branchSpacing, y: yOffset },
    });

    // Connect branch to repo
    newEdges.push({
      id: `e-repo-${branchId}`,
      source: "repo",
      target: branchId,
      animated: true,
    });
  });

  yOffset += 100;

  // Add workflow files
  if (workflows.length > 0) {
    workflows.forEach((workflow: any, index: number) => {
      const id = `workflow-${index}`;
      newNodes.push({
        id,
        type: "github",
        data: { label: workflow.name || workflow.path, type: "file" },
        position: { x: 250, y: yOffset + index * 100 },
      });
      newEdges.push({
        id: `e-branch-${id}`,
        source: "branch-main",
        target: id,
        animated: true,
      });
    });
    yOffset += workflows.length * 100;
  }

  // Add commit nodes with branch connections
  if (commits.length > 0) {
    commits.forEach((commit, index) => {
      const id = `commit-${index}`;
      newNodes.push({
        id,
        type: "commit",
        data: {
          label: commit.sha.substring(0, 7),
          message: commit.commit.message.split("\n")[0],
          date: new Date(commit.commit.author.date).toLocaleDateString(),
        },
        position: { x: 500, y: yOffset + index * 100 },
      });

      // Connect commit to its branch if we can determine it
      const branchId = `branch-${branches.find(b => b.commit.sha === commit.sha)?.name || 'main'}`;
      newEdges.push({
        id: `e-branch-${id}`,
        source: branchId,
        target: id,
        animated: true,
      });
    });
  }

  // Add deployment nodes
  if (deployments.length > 0) {
    deployments.forEach((deployment, index) => {
      const id = `deployment-${index}`;
      newNodes.push({
        id,
        type: "deployment",
        data: {
          label: `Deployment #${deployment.id}`,
          environment: deployment.environment,
          status: deployment.state,
          date: new Date(deployment.created_at).toLocaleDateString(),
        },
        position: { x: 0, y: yOffset + index * 100 },
      });
      newEdges.push({
        id: `e-branch-${id}`,
        source: "branch-main",
        target: id,
        animated: true,
      });
    });
  }

  return { nodes: newNodes, edges: newEdges };
};