import { Node } from "@xyflow/react";
import { Contributor } from "@/types/collaboration";

export interface ShareableState {
  nodes: Node[];
  edges: Edge[];
  zoom: number;
  position: [number, number];
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
