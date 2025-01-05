import { Edge as ReactFlowEdge, Node } from "@xyflow/react";
import { Contributor } from "@/types/collaboration";

export interface ShareableState {
  nodes: Node[];
  edges: ReactFlowEdge[];
  zoom: number;
  position: [number, number];
}

export interface DeploymentNodeData {
  label: string;
  environment: string;
  status: string;
  date: string;
}

export interface LanguageNodeData {
  language: string;
  percentage: number;
  repoName: string;
}

export interface BranchNodeData {
  label: string;
  commits?: Array<{
    sha: string;
    message: string;
    date: string;
  }>;
  heatLevel?: number;
  isCollapsed?: boolean;
  tags?: Array<{
    name: string;
    type: "lightweight" | "annotated";
    message?: string;
  }>;
  fileChanges?: Array<{
    path: string;
    changes: number;
  }>;
  contributors?: Contributor[];
}