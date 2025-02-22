
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session) {
      // Save the attempted route
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [session, navigate, location]);

  // Only render children if user is authenticated
  if (!session) {
    return null;
  }

  return <>{children}</>;
};
