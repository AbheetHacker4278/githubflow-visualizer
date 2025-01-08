import { Contributor } from "./collaboration";

export interface LanguageNodeData {
  language: string;
  percentage: number;
  repoName: string;
  [key: string]: unknown;
}

export interface BranchNodeData {
  label: string;
  commits?: Array<{
    sha: string;
    message: string;
    date: string;
  }>;
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
  contributors?: Contributor[];
  [key: string]: unknown;
}

export interface DeploymentNodeData {
  label: string;
  environment: string;
  status: string;
  date: string;
  [key: string]: unknown;
}

export interface Deployment {
  id: string;
  environment: string;
  state: string;
  created_at: string;
}