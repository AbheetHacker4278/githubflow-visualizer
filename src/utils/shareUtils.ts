import { Node, Edge } from "@xyflow/react";

export interface ShareableState {
  nodes: Node[];
  edges: Edge[];
  zoom: number;
  position: [number, number];
}

export const encodeState = (state: ShareableState): string => {
  return btoa(JSON.stringify(state));
};

export const decodeState = (encoded: string): ShareableState | null => {
  try {
    return JSON.parse(atob(encoded));
  } catch (error) {
    console.error("Failed to decode state:", error);
    return null;
  }
};

export const getStateFromUrl = (): ShareableState | null => {
  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get("state");
  if (!stateParam) return null;
  
  try {
    return JSON.parse(decodeURIComponent(stateParam));
  } catch (error) {
    console.error("Failed to parse state from URL:", error);
    return null;
  }
};