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

export const fetchRepoData = async (owner: string, repo: string) => {
  try {
    // Fetch repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoResponse.ok) throw new Error("Repository not found");
    const repoData = await repoResponse.json();
    console.log("Repository data:", repoData);

    // Fetch languages data
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
    const languages = languagesResponse.ok ? await languagesResponse.json() : {};
    console.log("Languages data:", languages);

    // Try to fetch workflow files - handle 404 gracefully
    let workflows: any[] = [];
    try {
      const workflowsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`
      );
      if (workflowsResponse.ok) {
        workflows = await workflowsResponse.json();
        console.log("Workflows found:", workflows);
      } else if (workflowsResponse.status === 404) {
        console.log("No workflows directory found - this is normal for repositories without GitHub Actions");
      } else {
        console.warn("Unexpected status when fetching workflows:", workflowsResponse.status);
      }
    } catch (error) {
      console.log("No workflows found:", error);
      // Continue execution - workflows will remain an empty array
    }

    // Fetch recent commits
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`
    );
    const commits: GitHubCommit[] = commitsResponse.ok ? await commitsResponse.json() : [];
    console.log("Commits found:", commits);

    // Fetch deployments
    const deploymentsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/deployments?per_page=5`
    );
    const deployments: GitHubDeployment[] = deploymentsResponse.ok ? await deploymentsResponse.json() : [];
    console.log("Deployments found:", deployments);

    return { repoData, workflows, commits, deployments, languages };
  } catch (error) {
    console.error("Error fetching repository data:", error);
    throw error;
  }
};