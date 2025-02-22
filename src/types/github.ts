
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
