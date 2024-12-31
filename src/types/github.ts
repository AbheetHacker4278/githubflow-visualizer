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
}

export interface DatabaseInfo {
  name: string;
  type: string;
  tables?: string[];
}