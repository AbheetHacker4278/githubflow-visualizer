
import { useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      // Get the previous path from localStorage or default to '/chat'
      const previousPath = location.state?.from || '/chat';
      navigate(previousPath, { replace: true });
    }
  }, [session, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Sign in to your account
        </h2>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["github", "google"]}
        />
      </div>
    </div>
  );
};

export default Auth;
