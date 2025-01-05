export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
}

export interface GitHubDeployment {
  id: number;
  environment: string;
  state: string;
  created_at: string;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

export interface BranchData {
  label: string;
  commits: Array<{ sha: string; message: string; date: string; }>;
  heatLevel: number;
  isCollapsed: boolean;
  tags: Array<{ name: string; type: "lightweight" | "annotated"; message?: string; }>;
  fileChanges: Array<{ path: string; changes: number; }>;
}

export interface Deployment {
  label: string;
  environment: string;
  status: string;
  date: string;
}