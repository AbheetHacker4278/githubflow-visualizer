const getGithubToken = (): string | null => {
  return localStorage.getItem('github_token');
};

export const fetchWithAuth = async (url: string): Promise<Response> => {
  const token = getGithubToken();
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  
  if (response.status === 403) {
    const rateLimitError = await response.json();
    if (rateLimitError.message?.includes('API rate limit exceeded')) {
      const token = prompt('Please enter your GitHub personal access token to continue:');
      if (token) {
        localStorage.setItem('github_token', token);
        return fetchWithAuth(url);
      }
    }
  }

  if (response.status === 401) {
    localStorage.removeItem('github_token');
    const token = prompt('Invalid token. Please enter a valid GitHub personal access token:');
    if (token) {
      localStorage.setItem('github_token', token);
      return fetchWithAuth(url);
    }
  }

  return response;
};