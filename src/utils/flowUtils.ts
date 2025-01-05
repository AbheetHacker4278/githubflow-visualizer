import { Node, Edge } from "@xyflow/react";
import { GitHubCommit, GitHubDeployment, GitHubBranch } from "../types/github";
import { LanguageNodeData, BranchNodeData } from "../types/nodes";
import { Contributor } from "@/types/collaboration";

const calculateBranchHeatLevel = (commits: GitHubCommit[] = [], branch: GitHubBranch): number => {
  if (!commits.length) return 0;
  const now = new Date();
  const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
  
  const recentCommits = commits.filter(commit => 
    new Date(commit.commit.author.date) > oneMonthAgo
  );

  return Math.min(100, Math.round((recentCommits.length / commits.length) * 100));
};

const getContributors = (commits: GitHubCommit[]): Contributor[] => {
  const contributorMap = new Map<string, { commits: number; lastActive: string }>();
  
  commits.forEach(commit => {
    const name = commit.commit.author.name;
    const existing = contributorMap.get(name) || { commits: 0, lastActive: commit.commit.author.date };
    
    contributorMap.set(name, {
      commits: existing.commits + 1,
      lastActive: new Date(existing.lastActive) > new Date(commit.commit.author.date) 
        ? existing.lastActive 
        : commit.commit.author.date
    });
  });

  return Array.from(contributorMap.entries())
    .map(([name, data]) => ({
      name,
      commits: data.commits,
      lastActive: data.lastActive
    }))
    .sort((a, b) => b.commits - a.commits);
};

export const createNodesAndEdges = (
  data: any,
  workflows: any[] = [],
  commits: GitHubCommit[] = [],
  deployments: GitHubDeployment[] = [],
  languages: Record<string, number> = {},
  branches: GitHubBranch[] = []
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

  // Add branches nodes with commit data, heat levels, and contributors
  if (branches.length > 0) {
    branches.forEach((branch, index) => {
      const id = `branch-${index}`;
      const branchCommits = commits
        .slice(0, 5)
        .map(commit => ({
          sha: commit.sha,
          message: commit.commit.message,
          date: new Date(commit.commit.author.date).toLocaleDateString()
        }));

      const heatLevel = calculateBranchHeatLevel(commits, branch);
      const isCollapsed = heatLevel < 25; // Collapse inactive branches by default
      const contributors = getContributors(commits);

      // Mock tags for demonstration - replace with actual tags data
      const tags = branch.name === "main" ? [
        { name: "v1.0.0", type: "annotated" as const, message: "Major release" },
        { name: "latest", type: "lightweight" as const }
      ] : [];

      // Mock file changes - replace with actual file changes data
      const fileChanges = [
        { path: "src/main.ts", changes: 15 },
        { path: "package.json", changes: 3 }
      ];

      newNodes.push({
        id,
        type: "branch",
        data: { 
          label: branch.name,
          commits: branchCommits,
          heatLevel,
          isCollapsed,
          tags,
          fileChanges,
          contributors
        },
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

  // Add language nodes
  if (Object.keys(languages).length > 0) {
    const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
    Object.entries(languages).forEach(([language, bytes], index) => {
      const percentage = (bytes / totalBytes) * 100;
      const id = `lang-${index}`;
      const nodeData: LanguageNodeData = {
        language,
        percentage,
        repoName: data.name
      };
      newNodes.push({
        id,
        type: "language",
        data: nodeData,
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

  return { nodes: newNodes, edges: newEdges };
};
