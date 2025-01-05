import { GitHubCommit, GitHubDeployment, GitHubBranch } from "../types/github";

const GITHUB_TOKEN_KEY = 'github_token';

const getGitHubToken = () => {
  return localStorage.getItem(GITHUB_TOKEN_KEY);
};

const setGitHubToken = (token: string) => {
  localStorage.setItem(GITHUB_TOKEN_KEY, token);
};

const clearGitHubToken = () => {
  localStorage.removeItem(GITHUB_TOKEN_KEY);
};

const getHeaders = (token: string | null = null) => {
  const currentToken = token || getGitHubToken();
  return currentToken ? {
    'Authorization': `Bearer ${currentToken}`,
    'Accept': 'application/vnd.github.v3+json'
  } : {
    'Accept': 'application/vnd.github.v3+json'
  };
};

const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: getHeaders(token)
    });
    if (response.status === 401) {
      console.error("Invalid GitHub token");
      return false;
    }
    return response.status === 200;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

const getValidToken = async (): Promise<string | null> => {
  let token = getGitHubToken();
  
  // If we have a token and it's valid, use it
  if (token && await validateToken(token)) {
    return token;
  }
  
  // Clear invalid token
  clearGitHubToken();
  
  // Prompt for new token with clear instructions
  token = prompt(
    'Please enter your GitHub Personal Access Token (PAT).\n\n' +
    'To create a new token:\n' +
    '1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)\n' +
    '2. Generate new token (classic)\n' +
    '3. Give it "repo" scope\n' +
    '4. Copy and paste the token here'
  );
  
  if (!token) {
    throw new Error('GitHub token is required to fetch repository data');
  }

  if (await validateToken(token)) {
    setGitHubToken(token);
    return token;
  }
  
  throw new Error('Invalid GitHub token provided');
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchRepoData = async (owner: string, repo: string) => {
  let token = await getValidToken();
  if (!token) {
    throw new Error('Valid GitHub token is required to fetch repository data.');
  }

  const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
    for (let i = 0; i < retries; i++) {
      console.log(`Attempting to fetch ${url} (attempt ${i + 1}/${retries})`);
      const response = await fetch(url, { headers: getHeaders(token) });
      
      if (response.status === 404) {
        if (url.includes('workflows')) {
          console.log("No workflows found (this is normal for repositories without GitHub Actions)");
          return response;
        }
        throw new Error(`Repository "${owner}/${repo}" not found. Please check if the URL is correct and the repository exists.`);
      }
      
      if (response.status === 403) {
        const data = await response.json();
        if (data.message?.includes('API rate limit exceeded')) {
          clearGitHubToken();
          token = await getValidToken();
          if (!token) {
            throw new Error('Rate limit exceeded. Please provide a valid GitHub token with higher rate limits.');
          }
          continue;
        }
      }
      
      if (response.status === 401) {
        clearGitHubToken();
        token = await getValidToken();
        if (!token) {
          throw new Error('Unable to authenticate with GitHub. Please provide a valid token.');
        }
        continue;
      }
      
      if (response.ok) {
        return response;
      }

      if (i < retries - 1) {
        await wait(2000 * (i + 1)); // Exponential backoff
      }
    }
    
    throw new Error(`Failed to fetch data after ${retries} retries.`);
  };

  try {
    // Fetch repository information
    const repoResponse = await fetchWithRetry(`https://api.github.com/repos/${owner}/${repo}`);
    const repoData = await repoResponse.json();
    console.log("Repository data:", repoData);

    // Fetch branches data
    const branchesResponse = await fetchWithRetry(`https://api.github.com/repos/${owner}/${repo}/branches`);
    const branches: GitHubBranch[] = await branchesResponse.json();
    console.log("Branches found:", branches.length);

    // Fetch languages data
    const languagesResponse = await fetchWithRetry(`https://api.github.com/repos/${owner}/${repo}/languages`);
    const languages = await languagesResponse.json();
    console.log("Languages data:", languages);

    // Try to fetch workflow files
    let workflows: any[] = [];
    try {
      const workflowsResponse = await fetchWithRetry(
        `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`
      );
      if (workflowsResponse.ok) {
        workflows = await workflowsResponse.json();
      } else {
        console.log("No workflows found or access denied");
        workflows = [];
      }
    } catch (error) {
      console.log("Error fetching workflows (this is normal if the repository doesn't use GitHub Actions):", error);
      workflows = [];
    }

    // Fetch recent commits
    const commitsResponse = await fetchWithRetry(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`
    );
    const commits: GitHubCommit[] = await commitsResponse.json();
    console.log("Commits found:", commits.length);

    // Fetch deployments
    const deploymentsResponse = await fetchWithRetry(
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
