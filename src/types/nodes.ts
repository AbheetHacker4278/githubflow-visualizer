import { Node, Edge } from "@xyflow/react";

export interface LanguageNodeData {
  language: string;
  percentage: number;
  repoName: string;
}

export interface DeploymentNodeData {
  label: string;
  environment: string;
  status: string;
  date: string;
}

export interface ViewState {
  nodes: Node[];
  edges: Edge[];
  zoom: number;
  position: [number, number];
}

export interface Contributor {
  name: string;
  commits: number;
  lastActive: string;
}