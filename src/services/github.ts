import { GitHubCommit, GitHubDeployment, GitHubBranch } from "../types/github";

const GITHUB_TOKEN_KEY = 'github_token';

const getGitHubToken = () => {
  return localStorage.getItem(GITHUB_TOKEN_KEY);
};

const setGitHubToken = (token: string) => {
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
};

const getHeaders = () => {
  const token = getGitHubToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  } : {
    'Accept': 'application/vnd.github.v3+json'
  };
};

export const fetchRepoData = async (owner: string, repo: string) => {
  try {
    // Function to handle fetch with authentication
    const fetchWithAuth = async (url: string) => {
      console.log(`Fetching ${url}...`);
      const response = await fetch(url, { headers: getHeaders() });
      
      if (response.status === 404) {
        throw new Error(`Repository "${owner}/${repo}" not found. Please check if the URL is correct and the repository exists.`);
      }
      
      if (response.status === 403) {
        const data = await response.json();
        if (data.message?.includes('API rate limit exceeded')) {
          const token = prompt('Please enter your GitHub token to increase rate limits:');
          if (token) {
            setGitHubToken(token);
            // Retry the request with the new token
            return fetch(url, { headers: getHeaders() });
          }
        }
      } else if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem(GITHUB_TOKEN_KEY);
        const token = prompt('Invalid token. Please enter a valid GitHub token:');
        if (token) {
          setGitHubToken(token);
          // Retry the request with the new token
          return fetch(url, { headers: getHeaders() });
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response;
    };

    // Fetch repository information
    const repoResponse = await fetchWithAuth(`https://api.github.com/repos/${owner}/${repo}`);
    const repoData = await repoResponse.json();
    console.log("Repository data:", repoData);

    // Fetch branches data
    const branchesResponse = await fetchWithAuth(`https://api.github.com/repos/${owner}/${repo}/branches`);
    const branches: GitHubBranch[] = await branchesResponse.json();
    console.log("Branches found:", branches.length);

    // Fetch languages data
    const languagesResponse = await fetchWithAuth(`https://api.github.com/repos/${owner}/${repo}/languages`);
    const languages = await languagesResponse.json();
    console.log("Languages data:", languages);

    // Try to fetch workflow files
    let workflows: any[] = [];
    try {
      const workflowsResponse = await fetchWithAuth(
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
      console.log("Error fetching workflows (this is normal if the repository doesn't use GitHub Actions):", error);
    }

    // Fetch recent commits
    const commitsResponse = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`
    );
    const commits: GitHubCommit[] = await commitsResponse.json();
    console.log("Commits found:", commits.length);

    // Fetch deployments
    const deploymentsResponse = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}/deployments?per_page=5`
    );
    const deployments: GitHubDeployment[] = await deploymentsResponse.json();
    console.log("Deployments found:", deployments.length);

    return { repoData, workflows, commits, deployments, languages, branches };
  } catch (error: any) {
    console.error("Error fetching repository data:", error);
    throw new Error(error.message || "Failed to fetch repository data");
  }
};