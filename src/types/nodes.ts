export interface LanguageNodeData {
  language: string;
  percentage: number;
  repoName: string;
  [key: string]: unknown;
}

export interface BranchNodeData {
  name: string;
  lastCommit: string;
  author: string;
  protected: boolean;
  heatLevel?: number;
  isCollapsed?: boolean;
  tags?: Array<{
    name: string;
    type: "lightweight" | "annotated";
    message?: string;
  }>;
  fileChanges?: Array<{
    path: string;
    changes: number;
  }>;
  [key: string]: unknown;
}

export interface DeploymentNodeData {
  label: string;
  environment: string;
  status: string;
  date: string;
  [key: string]: unknown;
}