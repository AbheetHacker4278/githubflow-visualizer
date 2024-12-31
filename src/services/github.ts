import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { GitHubCommit, GitHubDeployment, GitHubBranch, DatabaseInfo } from "../types/github";

export const fetchRepoData = async (owner: string, repo: string) => {
  try {
    const repoDataResponse = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    const repoData = await repoDataResponse.json();

    const workflowsResponse = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows`
    );
    const workflows = await workflowsResponse.json();

    const commitsResponse = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}/commits`
    );
    const commits = await commitsResponse.json();

    const deploymentsResponse = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}/deployments`
    );
    const deployments = await deploymentsResponse.json();

    const languagesResponse = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}/languages`
    );
    const languages = await languagesResponse.json();

    const branchesResponse = await fetchWithAuth(
      `https://api.github.com/repos/${owner}/${repo}/branches`
    );
    const branches = await branchesResponse.json();

    // Detect databases by checking for specific files
    let databases: DatabaseInfo[] = [];
    try {
      const rootContentsResponse = await fetchWithAuth(
        `https://api.github.com/repos/${owner}/${repo}/contents`
      );
      const rootContents = await rootContentsResponse.json();
      
      // Check for common database files and configurations
      const dbFiles = rootContents.filter((file: any) => {
        const fileName = file.name.toLowerCase();
        return (
          fileName.includes('database') ||
          fileName.includes('schema.') ||
          fileName.includes('prisma') ||
          fileName.includes('sequelize') ||
          fileName.includes('knexfile') ||
          fileName.includes('typeorm') ||
          fileName === 'supabase'
        );
      });

      if (dbFiles.length > 0) {
        databases = dbFiles.map((file: any) => ({
          name: file.name,
          type: detectDatabaseType(file.name),
        }));
        console.log("Detected databases:", databases);
      }
    } catch (error) {
      console.log("Error detecting databases:", error);
    }

    return { repoData, workflows, commits, deployments, languages, branches, databases };
  } catch (error) {
    console.error("Error fetching repository data:", error);
    throw error;
  }
};

const detectDatabaseType = (fileName: string): string => {
  fileName = fileName.toLowerCase();
  if (fileName.includes('prisma')) return 'Prisma';
  if (fileName.includes('sequelize')) return 'Sequelize';
  if (fileName.includes('typeorm')) return 'TypeORM';
  if (fileName.includes('knex')) return 'Knex.js';
  if (fileName.includes('supabase')) return 'Supabase';
  if (fileName.includes('mongoose')) return 'MongoDB';
  return 'Unknown Database';
};
