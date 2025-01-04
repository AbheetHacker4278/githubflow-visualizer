export interface Contributor {
  name: string;
  commits: number;
  lastActive: string;
}

export interface BranchMetrics {
  activityLevel: number; // 0-100
  contributors: Contributor[];
  mergeFrequency: number; // merges per week
  lastUpdated: string;
}