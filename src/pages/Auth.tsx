import React, { useState, useEffect } from 'react';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Menu } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from '@supabase/supabase-js';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/app");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/app");
      }
      if (event === 'USER_UPDATED') {
        const handleError = async () => {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        };
        handleError();
      }
      if (event === 'SIGNED_OUT') {
        setErrorMessage(""); // Clear errors on sign out
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'email_not_confirmed':
          return 'Please verify your email address before signing in.';
        case 'user_not_found':
          return 'No user found with these credentials.';
        case 'invalid_grant':
          return 'Invalid login credentials.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-800 to-slate-900">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-lg border-b border-white/10' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                GitViz
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:bg-white/10 border rounded-full border-purple-400"
              >
                Back to Home
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="py-4 space-y-4 bg-gray-900 text-white">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-4 px-4">
                <Button
                  onClick={() => navigate("/")}
                  variant="ghost"
                  className="w-full text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-white/10">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Welcome to GitViz
          </h1>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3B82F6',
                    brandAccent: '#2563EB',
                  }
                }
              },
              style: {
                button: {
                  padding: '10px',
                  borderRadius: '8px',
                },
                input: {
                  borderRadius: '6px',
                },
              }
            }}
            providers={["github", "google"]}
            redirectTo={`${window.location.origin}/app`}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;