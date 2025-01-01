export interface LanguageNodeData {
  language: string;
  percentage: number;
  repoName: string;
}

export interface CommitNodeData {
  label: string;
  message: string;
  date: string;
}

export interface DeploymentNodeData {
  label: string;
  environment: string;
  status: string;
  date: string;
}