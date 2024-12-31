import { GitHubCommit, GitHubDeployment, GitHubBranch } from "../types/github";

const getGitHubToken = () => localStorage.getItem('GITHUB_TOKEN');

const createAuthHeader = () => {
  const token = getGitHubToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const initializeGitHubToken = (token: string) => {
  localStorage.setItem('GITHUB_TOKEN', token);
  console.log('GitHub token initialized');
};

export const fetchRepoData = async (owner: string, repo: string) => {
  try {
    const headers = createAuthHeader();

    // Fetch repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers
    });
    
    if (!repoResponse.ok) {
      const errorData = await repoResponse.json();
      if (repoResponse.status === 403 && errorData.message?.includes('API rate limit exceeded')) {
        throw new Error("GitHub API rate limit exceeded. Please provide a GitHub token for higher limits.");
      }
      throw new Error(errorData.message || "Repository not found");
    }
    
    const repoData = await repoResponse.json();
    console.log("Repository data:", repoData);

    // Fetch branches data
    const branchesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
      headers
    });
    const branches: GitHubBranch[] = branchesResponse.ok ? await branchesResponse.json() : [];
    console.log("Branches found:", branches.length);

    // Fetch languages data
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers
    });
    const languages = languagesResponse.ok ? await languagesResponse.json() : {};
    console.log("Languages data:", languages);

    // Try to fetch workflow files - handle 404 gracefully
    let workflows: any[] = [];
    try {
      const workflowsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`,
        { headers }
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
      console.log("Error fetching workflows (this is normal if the repository doesn't use GitHub Actions):", error);
    }

    // Fetch recent commits
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
      { headers }
    );
    const commits: GitHubCommit[] = commitsResponse.ok ? await commitsResponse.json() : [];
    console.log("Commits found:", commits.length);

    // Fetch deployments
    const deploymentsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/deployments?per_page=5`,
      { headers }
    );
    const deployments: GitHubDeployment[] = deploymentsResponse.ok ? await deploymentsResponse.json() : [];
    console.log("Deployments found:", deployments.length);

    return { repoData, workflows, commits, deployments, languages, branches };
  } catch (error: any) {
    console.error("Error fetching repository data:", error);
    throw new Error(error.message || "Failed to fetch repository data");
  }
};