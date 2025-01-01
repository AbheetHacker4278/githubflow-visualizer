import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/app");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-github-darker to-github-dark">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-github-accent to-github-success bg-clip-text text-transparent">
              Faster, Smarter
              <br />
              GitHub Visualization
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl">
              Enabling seamless repository visualization while making development workflow analysis simple and intuitive.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => navigate("/auth")}
                className="px-8 py-6 text-lg bg-github-accent hover:bg-github-accent/90"
              >
                Get Started
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-github-accent/20 to-github-success/20 rounded-lg backdrop-blur-3xl animate-float"></div>
              <img
                src="/placeholder.svg"
                alt="GitHub Flow Visualization"
                className="relative z-10 w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Repository Analysis",
              description: "Analyze your GitHub repositories with detailed insights and visualizations.",
              icon: "📊",
            },
            {
              title: "Language Breakdown",
              description: "Understand the language composition of your codebase at a glance.",
              icon: "🔍",
            },
            {
              title: "Workflow Visualization",
              description: "Visualize your GitHub Actions workflows and deployment processes.",
              icon: "🔄",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 hover:border-github-accent/50 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;