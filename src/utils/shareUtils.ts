import { ShareableState } from "@/types/sharing";

export const encodeShareableState = (state: ShareableState): string => {
  return encodeURIComponent(btoa(JSON.stringify(state)));
};

export const decodeShareableState = (encoded: string): ShareableState | null => {
  try {
    return JSON.parse(atob(decodeURIComponent(encoded)));
  } catch (error) {
    console.error("Failed to decode shareable state:", error);
    return null;
  }
};

export const createShareableUrl = (state: ShareableState): string => {
  const baseUrl = window.location.origin;
  const encodedState = encodeShareableState(state);
  return `${baseUrl}?share=${encodedState}`;
};