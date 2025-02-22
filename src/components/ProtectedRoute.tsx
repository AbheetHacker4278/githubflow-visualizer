import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  console.log("ProtectedRoute - Session status:", session ? "Authenticated" : "Unauthenticated");
  
  // Allow access regardless of authentication status
  return <>{children}</>;
};