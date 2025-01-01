import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-github-darker to-github-dark p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-white/10">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#58A6FF',
                  brandAccent: '#1F6FEB',
                }
              }
            }
          }}
          providers={["github", "google"]}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};

export default AuthPage;