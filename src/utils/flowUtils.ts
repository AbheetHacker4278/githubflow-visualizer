import { Node, Edge } from "@xyflow/react";
import { GitHubCommit, GitHubDeployment, GitHubBranch, DatabaseInfo } from "../types/github";

export const createNodesAndEdges = (
  data: any,
  workflows: any[] = [],
  commits: GitHubCommit[] = [],
  deployments: GitHubDeployment[] = [],
  languages: Record<string, number> = {},
  branches: GitHubBranch[] = [],
  databases: DatabaseInfo[] = []
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

  // Add branches nodes
  if (branches.length > 0) {
    branches.forEach((branch, index) => {
      const id = `branch-${index}`;
      newNodes.push({
        id,
        type: "github",
        data: { label: branch.name, type: "branch" },
        position: { x: -200 + (index * 150), y: yOffset },
      });
      newEdges.push({
        id: `e-repo-${id}`,
        source: "repo",
        target: id,
        animated: true,
      });
    });
    yOffset += 100;
  }

  // Add default branch node if no branches were found
  if (branches.length === 0) {
    newNodes.push({
      id: "branch",
      type: "github",
      data: { label: data.default_branch, type: "branch" },
      position: { x: 250, y: yOffset },
    });
    newEdges.push({
      id: "e-repo-branch",
      source: "repo",
      target: "branch",
      animated: true,
    });
  }

  // Add language nodes with repo name
  if (Object.keys(languages).length > 0) {
    const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
    Object.entries(languages).forEach(([language, bytes], index) => {
      const percentage = (bytes / totalBytes) * 100;
      const id = `lang-${index}`;
      newNodes.push({
        id,
        type: "language",
        data: { 
          language, 
          percentage,
          repoName: data.name 
        },
        position: { x: -200, y: 200 + index * 80 },
      });
      newEdges.push({
        id: `e-repo-${id}`,
        source: "repo",
        target: id,
        animated: true,
      });
    });
  }

  // Add workflow files
  if (workflows.length > 0) {
    yOffset += 100;
    workflows.forEach((workflow: any, index: number) => {
      const id = `workflow-${index}`;
      newNodes.push({
        id,
        type: "github",
        data: { label: workflow.name || workflow.path, type: "file" },
        position: { x: 250, y: yOffset },
      });
      newEdges.push({
        id: `e-branch-${id}`,
        source: branches.length > 0 ? `branch-0` : "branch",
        target: id,
        animated: true,
      });
      yOffset += 100;
    });
  }

  // Add commit nodes
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
        position: { x: 500, y: 100 + index * 100 },
      });
      newEdges.push({
        id: `e-branch-${id}`,
        source: branches.length > 0 ? `branch-0` : "branch",
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
        position: { x: 0, y: 100 + index * 100 },
      });
      newEdges.push({
        id: `e-branch-${id}`,
        source: branches.length > 0 ? `branch-0` : "branch",
        target: id,
        animated: true,
      });
    });
  }

  // Add database nodes
  if (databases.length > 0) {
    databases.forEach((database, index) => {
      const id = `database-${index}`;
      newNodes.push({
        id,
        type: "database",
        data: {
          name: database.name,
          type: database.type,
          tables: database.tables
        } as DatabaseInfo,
        position: { x: 750, y: 100 + index * 150 },
      });
      newEdges.push({
        id: `e-repo-${id}`,
        source: "repo",
        target: id,
        animated: true,
      });
    });
  }

  return { nodes: newNodes, edges: newEdges };
};