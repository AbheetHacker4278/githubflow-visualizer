export interface LanguageNodeData {
  language: string;
  percentage: number;
  repoName: string;
}

export interface GitHubNodeData {
  name: string;
  description: string;
  stars: number;
  forks: number;
}

export interface CommitNodeData {
  message: string;
  author: string;
  date: string;
}

export interface DeploymentNodeData {
  environment: string;
  status: string;
  url: string;
}