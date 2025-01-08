export interface Contributor {
  name: string;
  commits: number;
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
}

export interface DeploymentNodeData {
  label: string;
  environment: string;
  status: string;
  date: string;
  commits?: Array<{
    sha: string;
    message: string;
    date: string;
  }>;
}
