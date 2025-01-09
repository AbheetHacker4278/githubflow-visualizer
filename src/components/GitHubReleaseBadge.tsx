import { useQuery } from "@tanstack/react-query";

interface Release {
  tag_name: string;
  html_url: string;
}

const fetchLatestRelease = async (): Promise<Release | null> => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/AbheetHacker4278/githubflow-visualizer/releases/latest"
    );
    
    if (response.status === 404) {
      console.log("No releases found for this repository");
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching release info:", error);
    return null;
  }
};

const GitHubReleaseBadge = () => {
  const { data: release, isLoading } = useQuery({
    queryKey: ["github-release"],
    queryFn: fetchLatestRelease,
  });

  if (isLoading) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-github-darker text-github-accent animate-pulse">
        Loading...
      </div>
    );
  }

  if (!release) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-github-darker text-github-accent">
        Pre-release
      </div>
    );
  }

  return (
    <a
      href={release.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-github-darker text-github-accent hover:bg-github-darker/80 transition-colors"
    >
      Latest Release: {release.tag_name}
    </a>
  );
};

export default GitHubReleaseBadge;