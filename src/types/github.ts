
export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
      name: string;
    };
  };
}

export interface Tag {
  name: string;
  type: "lightweight" | "annotated";
  message?: string;
}

export interface FileChange {
  path: string;
  changes: number;
}

export interface GitHubDeployment {
  id: number;
  environment: string;
  state: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}
