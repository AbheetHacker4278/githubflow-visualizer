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

export const fetchRepoData = async (owner: string, repo: string) => {
  try {
    // Fetch repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoResponse.ok) throw new Error("Repository not found");
    const repoData = await repoResponse.json();

    // Fetch branches
    const branchesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/branches`
    );
    const branches: GitHubBranch[] = branchesResponse.ok ? await branchesResponse.json() : [];
    console.log("Branches found:", branches);

    // Try to fetch workflow files
    let workflows: any[] = [];
    try {
      const workflowsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`
      );
      if (workflowsResponse.ok) {
        workflows = await workflowsResponse.json();
        console.log("Workflows found:", workflows);
      }
    } catch (error) {
      console.log("No workflows found");
    }

    // Fetch recent commits with their branch information
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`
    );
    const commits: GitHubCommit[] = commitsResponse.ok ? await commitsResponse.json() : [];
    console.log("Commits found:", commits);

    // Fetch pull requests
    const pullsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=5`
    );
    const pulls = pullsResponse.ok ? await pullsResponse.json() : [];
    console.log("Pull requests found:", pulls);

    // Fetch deployments
    const deploymentsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/deployments?per_page=5`
    );
    const deployments: GitHubDeployment[] = deploymentsResponse.ok ? await deploymentsResponse.json() : [];
    console.log("Deployments found:", deployments);

    return { repoData, workflows, commits, deployments, branches, pulls };
  } catch (error) {
    console.error("Error fetching repository data:", error);
    throw error;
  }
};