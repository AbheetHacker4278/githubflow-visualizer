export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export interface GitHubDeployment {
  id: string;
  environment: string;
  state: string;
  created_at: string;
}

export interface GitHubBranch {
  name: string;
}