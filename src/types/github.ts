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
  description: string;
  created_at: string;
  state: string;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
  };
}